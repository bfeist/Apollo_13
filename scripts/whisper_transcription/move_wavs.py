import os
import subprocess

inputPath = "K:/tempK/whisper/"

for root, dirs, files in os.walk(inputPath):
  for dir in dirs:
    print("Processing " + dir)
    
    # create subdirectory for wavs
    os.makedirs(os.path.join(inputPath, dir, "wavs"), exist_ok=True)
    filenames = os.listdir(os.path.join(inputPath, dir))

    for filename in filenames:
      os.rename(os.path.join(inputPath, dir, filename), os.path.join(inputPath, dir, "wavs", filename))