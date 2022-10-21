import os
import subprocess

workingPath = "K:/tempK/whisper/"

for root, tapes, files in os.walk(workingPath):
  for tape in tapes:
    print("Processing Tape: " + tape)
    
    for root, tracks, files in os.walk(os.path.join(workingPath, tape)):
      for trackFolder in tracks:
        if "CH20" in trackFolder and "HR2" in tape:
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
              end = lastStart + 8
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
              lastStart += 8
              print(f"Transcribed ({lastStart}-{lastStart+8}/{len(wavs)})")
              if stopAfterThis:
                  break
