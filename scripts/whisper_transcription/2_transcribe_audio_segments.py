import os
import subprocess


def split_list(a_list):
    half = len(a_list) // 2
    return a_list[:half], a_list[half:]


inputPath = "F:/tempF/temp_wav/"
outputPath = "F:/tempF/temp_transcripts/"

# # loop through all wav files in the temp_wav folder
# for filename in os.listdir(inputPath):
#     if filename.endswith(".wav"):
#         # if the output vtt file already exists, skip this file
#         outputFilenameWithPath = os.path.join(inputPath, filename.replace(".wav", ".vtt"))
#         if not os.path.exists(outputFilenameWithPath):
#             whisperCommand = f"whisper --model medium.en --output_dir {outputPath} {os.path.join(inputPath, filename)} "


wavs = []
for filename in os.listdir(inputPath):
    if filename.endswith(".wav"):
        wavs.append(f"{inputPath}{filename}")

lastStart = 0
for wav in wavs:
    end = lastStart + 10
    if end > len(wavs):
        end = len(wavs)
    wavBatch = wavs[lastStart:end]
    wavBatchString = " ".join(wavBatch)
    whisperCommand = f"whisper --model medium.en --output_dir {outputPath} {wavBatchString} "
    subprocess.call(
        whisperCommand,
        shell=True,
    )
    lastStart += 10
    print(f"Transcribed {wav} ({lastStart}/{len(wavs)})")
