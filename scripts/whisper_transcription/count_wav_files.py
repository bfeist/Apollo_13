import os


inputPath = "E:/A13_MOCR_transcription/"

# loop through the wav output directories and count the number of files in each directory
for tape in os.listdir(inputPath):
    if not os.path.isdir(os.path.join(inputPath, tape)):
        continue

    for trackFolder in os.listdir(os.path.join(inputPath, tape)):
        if not os.path.isdir(os.path.join(inputPath, tape, trackFolder, "wavs")):
            continue

        # create subdirectory for wavs
        wavDir = os.path.join(inputPath, tape, trackFolder, "wavs")

        # count the number of files in the wav directory
        wavCount = len([name for name in os.listdir(wavDir) if os.path.isfile(os.path.join(wavDir, name))])
        print(f"Number of wav files in {wavDir}: {wavCount}")
