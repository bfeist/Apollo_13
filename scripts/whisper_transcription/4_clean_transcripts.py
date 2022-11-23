import os
from operator import itemgetter
import mod_scrub_content


inputPath = "E:/A13_MOCR_transcription/_raw_transcripts/"
outputPath = "E:/A13_MOCR_transcription/_transcripts/"

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

            # remove duplicate lines
            if content == prevcontent:
                continue
            prevcontent = content
            scrubbedContent, skip = itemgetter("content", "skip")(mod_scrub_content.scrubContent(content.strip()))
            if not skip:
                transcript.append(f"{timestamp}||{scrubbedContent}")

    # create the output file
    with open(f"{outputPath}{file}", "w", encoding="utf-8") as f:
        for line in transcript:
            f.write("\n" + line)
