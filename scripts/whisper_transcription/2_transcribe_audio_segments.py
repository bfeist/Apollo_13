import os
import subprocess

workingPath = "E:/A13_MOCR_transcription/"

for tape in os.listdir(workingPath):
    if not os.path.isdir(os.path.join(workingPath, tape)):
        continue

    print("Processing Tape: " + tape)

    for trackFolder in os.listdir(os.path.join(workingPath, tape)):
        print("Processing TrackFolder: " + trackFolder)

        # create subdirectory for wavs
        wavDir = os.path.join(workingPath, tape, trackFolder, "wavs")
        outputDir = os.path.join(workingPath, tape, trackFolder, "transcripts")
        os.makedirs(name=outputDir, exist_ok=True)

        wavs = []
        for filename in os.listdir(wavDir):
            if filename.endswith(".wav"):
                if os.path.exists(os.path.join(outputDir, filename + ".vtt")):
                    continue
                wavs.append(f"{os.path.join(wavDir, filename)}")

        if len(wavs) == 0:
            continue

        lastStart = 0
        stopAfterThis = False
        while 1 == 1:
            end = lastStart + 15
            if end > len(wavs):
                end = len(wavs)
                stopAfterThis = True
            wavBatch = wavs[lastStart:end]
            wavBatchString = " ".join(wavBatch)
            whisperCommand = f"whisper --model small.en --output_dir {outputDir} {wavBatchString} "
            print(whisperCommand)
            subprocess.call(
                whisperCommand,
                shell=True,
            )
            print(f"Transcribed ({lastStart}-{lastStart+15}/{len(wavs)})")
            lastStart += 15

            if stopAfterThis:
                break
