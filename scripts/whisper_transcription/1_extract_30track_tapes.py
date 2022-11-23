import utils
import subprocess
import os
import re
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


def _getActivityFromFFmpegSilenceOutput(ffmpegOutputText):
    outputArr = ffmpegOutputText.split("\n")
    silences = []
    silence = {}
    start_secs = 0
    end_secs = 0
    duration_secs = 0
    for line in outputArr:
        # get real duration from ffmpeg after it has run through the variable bitrate file
        if "size=N/A time=" in line:
            match = re.search(r"size=N/A time=(.*?) bitrate=", line)
            if match:
                duration_vals = list(map(float, match.group(1).split(":")))

        if "silencedetect" in line:
            # find the text after "silence_start" and before the end of the line using regex
            match = re.search(r"silence_start: (.*?)$", line)
            if match:
                # write previous gathered start-stop range to the silence_array
                if silence:
                    silences.append(silence)
                start_secs = float(match.group(1))
            else:
                match = re.search(r"(.*)silence_end: (.*?) |", line)
                if match:
                    end_secs = float(match.group(2))
                    match = re.search(r"silence_duration: (.*?)$", line)
                    if match:
                        duration_secs = float(match.group(1))
            silence = {"start_secs": start_secs, "end_secs": end_secs, "duration_secs": duration_secs}
    silences.append(silence)

    # loop through the duration of the file and create an object opposite of the ranges in the silence_array
    # Assume the file starts with sound
    is_sound_active = False
    last_is_sound_active = False
    sound_start_secs = 0
    sound_stop_secs = 0
    active_sounds = []
    total_duration_secs = duration_vals[0] * 3600 + duration_vals[1] * 60 + duration_vals[2]
    # if there are no silences, assume the whole file is sound
    if silences[0] == {}:
        active_sounds.append(
            {
                "sound_start_secs": 0,
                "sound_stop_secs": total_duration_secs,
                "duration": total_duration_secs,
            }
        )
        return active_sounds

    for i in range(0, int(total_duration_secs)):
        # if this second is in any silence array range, then the sound has stopped
        if any(d["start_secs"] <= i <= d["end_secs"] for d in silences):
            is_sound_active = False
        else:
            is_sound_active = True

        # if changed in the last second
        if is_sound_active != last_is_sound_active:
            if not is_sound_active:
                # sound has stopped, record the stop time and write the record to the active sound array
                sound_stop_secs = i
                active_sounds.append(
                    {
                        "sound_start_secs": sound_start_secs,
                        "sound_stop_secs": sound_stop_secs,
                        "duration": utils.secondsToHHMMSS(sound_stop_secs - sound_start_secs),
                    }
                )
            else:
                # sound has started, record the start time as one second previous to avoid cropping due to rounding seconds
                sound_start_secs = i if i == 0 else i - 1
        last_is_sound_active = is_sound_active
    # if the file ended with sound active, make the end cue the active region stop time
    if is_sound_active:
        active_sounds.append(
            {
                "sound_start_secs": sound_start_secs,
                "sound_stop_secs": total_duration_secs,
                "duration": total_duration_secs - sound_start_secs,
            }
        )
    return active_sounds


def detectRegionsOfActivityInCoverageVideo(path):
    # if the file length is 0 bytes then skip it
    if os.path.getsize(path) == 0:
        return []

    utils.log(f"Detecting audio activity ranges utilizing ffmpeg silence detection in file {path}")
    ffmpegCommand = f"ffmpeg -i {path} -nostats -af silencedetect=noise=-20dB:d={os.environ['SILENCE_DURATION_THRESHOLD']} -f null pipe:1"
    pipe = subprocess.run(ffmpegCommand, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=10 ** 8, shell=True)
    silence_ffmpeg_output = pipe.stderr.decode().replace("\r\n", "\n").replace("\n\r", "\n").replace("\r", "\n")
    activityRanges = _getActivityFromFFmpegSilenceOutput(silence_ffmpeg_output)
    utils.log("Activity ranges detected")
    return activityRanges


# encode this coverage video's audio regions of activity into aac files for transcription
def encodeWAVFilesForTranscriptionFromActivityRange(workingPath, inputFilename, outputPath, activityRanges):

    utils.log(f"Encoding WAV audio segments")
    os.makedirs(outputPath, exist_ok=True)

    # if the number of activity ranges is the same as the number of wav files in the output folder, skip encoding
    if len(activityRanges) == len(os.listdir(outputPath)):
        utils.log(f"WAV audio segments already encoded")
        return

    for activity in activityRanges:
        soundStartSecs = activity["sound_start_secs"]
        soundStopSecs = activity["sound_stop_secs"]
        outputFilename = (
            f'{inputFilename.split(".")[0]}__{activity["sound_start_secs"]}_{activity["sound_stop_secs"]}.wav'
        )
        audioOutputFilePath = os.path.join(outputPath, outputFilename)
        inputFilePath = os.path.join(workingPath, inputFilename)
        # if audioOutputFilePath already exists, skip this file
        if os.path.exists(audioOutputFilePath):
            utils.log(f"Skipping {audioOutputFilePath} because it already exists")
            continue

        ffmpegCommand = f"ffmpeg -y -i {inputFilePath} -ss {soundStartSecs} -to {soundStopSecs} -vn -acodec pcm_s16le {audioOutputFilePath}"
        subprocess.call(
            ffmpegCommand,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            shell=True,
        )
        utils.log("Encoded " + audioOutputFilePath)


inputPath = "O:/Apollo_13_30-Track/44.1/defluttered/"
workingPath = "E:/A13_MOCR_transcription/"

for root, dirs, files in os.walk(inputPath):
    for dir in dirs:
        for file in os.listdir(os.path.join(root, dir)):
            if (
                file.endswith(".wav")
                and not "CH1.wav" in file
                and not "CH01.wav" in file
                and not "CH30.wav" in file
                and not "CH31.wav" in file
                and not "CH32.wav" in file
            ):
                inputFilename = file
                inputFilenameWithPath = os.path.join(root, dir, inputFilename)

                outputPath = os.path.join(workingPath, dir.replace("_16khz", ""), file, "wavs")

                if not os.path.exists(outputPath):
                    os.makedirs(outputPath, exist_ok=True)
                    print("Processing " + inputFilename)
                    activityRanges = detectRegionsOfActivityInCoverageVideo(inputFilenameWithPath)
                    encodeWAVFilesForTranscriptionFromActivityRange(
                        inputPath + dir, inputFilename, outputPath, activityRanges
                    )
                else:
                    print(f"Skipping {outputPath} because it already exists")
