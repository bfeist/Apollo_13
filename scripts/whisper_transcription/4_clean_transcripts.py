import os
from operator import itemgetter
import mod_scrub_content


inputPath = "E:/A13_MOCR_transcription/_raw_transcripts/"
outputPath = "N:/Projects/Apollo/media.apolloinrealtime.org/A13/MOCR_audio/transcripts/"

for file in os.listdir(inputPath):
    if not file.endswith(".txt"):
        continue

    print("Processing " + file)

    # read the file
    transcript = []
    with open(f"{inputPath}{file}", "r", encoding="utf-8") as f:
        lines = f.readlines()

        prevcontent = ""
        for line in lines:
            [timestamp, content] = line.split("||")

            # convert timestamp to timeId
            timeId = timestamp.replace(":", "")
            # if the first char of timeId is "-", replace the first zero in the 3 digit hour with the negative sign.
            # This is timeId format use in AiRT.
            if timeId[0] == "-":
                timeId = "-" + timeId[2:]

            # remove duplicate lines
            if content == prevcontent:
                continue

            scrubbedContent, skip = itemgetter("content", "skip")(mod_scrub_content.scrubContent(content.strip()))
            if not skip:
                transcript.append(f"{timeId}|{scrubbedContent}")
            prevcontent = content

    # create the output file
    fileNumber = int(file.split("_")[1].split("CH")[1])
    if file.split("_")[0] == "HR2":
        fileNumber = fileNumber + 30

    with open(f"{outputPath}CH{fileNumber}_transcript.txt", "w", encoding="utf-8") as f:
        for line in transcript:
            f.write("\n" + line)
