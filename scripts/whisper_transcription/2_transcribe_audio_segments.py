import os
import subprocess

workingPath = "F:/A13_MOCR_transcription/"

for tape in os.listdir(workingPath):
    if not os.path.isdir(os.path.join(workingPath, tape)):
        continue
    if not ("HR1" in tape or "HR2" in tape):
        continue

    print("Processing Tape: " + tape)

    for trackFolder in os.listdir(os.path.join(workingPath, tape)):
        if not os.path.isdir(os.path.join(workingPath, tape, trackFolder)):
            continue
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

        segmentsPerBatch = 30
        lastStart = 0
        stopAfterThis = False
        while 1 == 1:
            end = lastStart + segmentsPerBatch
            if end > len(wavs):
                end = len(wavs)
                stopAfterThis = True
            wavBatch = wavs[lastStart:end]
            wavBatchString = " ".join(wavBatch)
            # whisperCommand = f"whisper --model small.en --output_dir {outputDir} {wavBatchString} "
            whisperCommand = f"whisper --model large-v2 --language en --output_dir {outputDir} {wavBatchString} "
            print(whisperCommand)
            subprocess.call(
                whisperCommand,
                shell=True,
            )
            print(f"Transcribed ({lastStart}-{end}/{len(wavs)})")
            lastStart += segmentsPerBatch

            if stopAfterThis:
                break
