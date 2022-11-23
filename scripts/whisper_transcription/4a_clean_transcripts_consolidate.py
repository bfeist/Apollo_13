import os
from operator import itemgetter
import re

import mod_scrub_content


def secondsFromGET(timestamp):
    values = re.split(":", timestamp)
    negative = False
    hourStr = values[0]
    # if the first character is a 1, remove it
    if hourStr[0] == "-":
        negative = True
        hourStr = hourStr[1:]

    hours = int(hourStr)
    minutes = int(values[1])
    seconds = int(values[2])
    totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds
    if negative:
        totalSeconds = totalSeconds * -1
    return totalSeconds


def GETFromSeconds(seconds):
    negative = False
    if seconds < 0:
        negative = True
        seconds = seconds * -1

    hours = seconds // (60 * 60)
    seconds %= 60 * 60
    minutes = seconds // 60
    seconds %= 60
    timestamp = "%03i:%02i:%02i" % (hours, minutes, seconds)
    if negative:
        timestamp = "-" + timestamp
    return timestamp


inputPath = "E:/A13_MOCR_transcription/_raw_transcripts/"
outputPath = "E:/A13_MOCR_transcription/_transcripts/"

# consolidate the raw transcripts into a single transcript with a column that indicates the channel. HR2 channels start at 31.
transcript = []
for file in os.listdir(inputPath):
    if not file.endswith(".txt"):
        continue

    print("Processing " + file)

    # match the track number from the filename
    channel = int(file.split("_")[1].replace("CH", ""))
    tapeType = file.split("_")[0]

    if tapeType == "HR2":
        channel = channel + 30

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
                transcript.append(f"{int(secondsFromGET(timestamp))}|{str(channel).zfill(2)}|{scrubbedContent}")

# sort the transcriptArr by the timestamp
transcript.sort(key=lambda x: int(x.split("|")[0]))

# create the output file
with open(f"{outputPath}allChannelsTranscript", "w", encoding="utf-8") as f:
    for line in transcript:
        origLine = line.split("|")
        f.write(f"\n{GETFromSeconds(int(origLine[0]))}|{origLine[1]}|{origLine[2]}")
