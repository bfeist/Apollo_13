import os
import subprocess

workingPath = "K:/tempK/whisper/"

for root, tapes, files in os.walk(workingPath):
  for tape in tapes:
    print("Processing Tape: " + tape)
    
    for root, tracks, files in os.walk(os.path.join(workingPath, tape)):
      for trackFolder in tracks:
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

        lastStart = 0
        for wav in wavs:
            end = lastStart + 10
            if end > len(wavs):
                end = len(wavs)
            wavBatch = wavs[lastStart:end]
            wavBatchString = " ".join(wavBatch)
            whisperCommand = f"whisper --model medium.en --output_dir {outputDir} {wavBatchString} "
            subprocess.call(
                whisperCommand,
                shell=True,
            )
            lastStart += 10
            print(f"Transcribed {wav} ({lastStart}/{len(wavs)})")
