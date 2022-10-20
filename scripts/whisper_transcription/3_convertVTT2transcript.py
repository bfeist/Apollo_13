import re, os

import tape_info


def secondsFromGET(timestamp):
    values = re.split(":", timestamp)
    hours = int(values[0])
    minutes = int(values[1])
    seconds = int(values[2])
    return (hours * 60 * 60) + (minutes * 60) + seconds


def GETFromSeconds(seconds):
    hours = seconds // (60 * 60)
    seconds %= 60 * 60
    minutes = seconds // 60
    seconds %= 60
    return "%03i:%02i:%02i" % (hours, minutes, seconds)


def nearestSecondFromVTTTimestamp(timestamp):
    temp = timestamp.replace(".", ":")
    values = re.split(r":", temp)
    minutes = int(values[0])
    seconds = int(values[1])
    milliseconds = int(values[2])
    return round((minutes * 60) + seconds + (milliseconds / 1000))


def showUtteranceGET(tapeStart, wavStart, vttTimestamp):
    return GETFromSeconds(secondsFromGET(tapeStart) + wavStart + nearestSecondFromVTTTimestamp(vttTimestamp))


inputPath = "F:/tempF/temp_transcripts/"

vtts = []
for filename in os.listdir(inputPath):
    if filename.endswith(".vtt"):
        vtts.append(f"{filename}")

tapeStart = tape_info.getTapeStartByFilename(vtts[0])

transcriptArr = []
for vtt in vtts:
    # vtt = "DA13_T709_HR2L_CH20__9851_9864.wav.vtt"
    with open(f"{inputPath}{vtt}", "r", encoding="utf-8") as f:
        print(f"Processing {vtt}")
        lines = f.readlines()

        wavStart = int(re.search(r"__(\d*)_", vtt).group(1))

        currentStart = ""
        uttStart = ""
        utterance = ""
        for line in lines:
            if re.match(r"^\n", line) or line.rstrip() == "WEBVTT":
                continue
            if re.match(r"(\d\d:\d\d.\d\d\d) --> (\d\d:\d\d.\d\d\d)", line):
                currentStart = line.split(" --> ")[0]
            else:
                if len(utterance) > 0:
                    utterance = utterance + " " + line.rstrip()
                else:
                    uttStart = currentStart
                    utterance = line.rstrip()

                # if the current line ends with a punctuation mark, then it's the end of the utterance. Write the line to the output file.
                if re.match(r".*[.?!…]$", line):
                    seconds = secondsFromGET(tapeStart) + wavStart + nearestSecondFromVTTTimestamp(uttStart)
                    transcriptArr.append(f"{seconds}||{utterance}")
                    utterance = ""

# sort the transcriptArr by the timestamp
transcriptArr.sort(key=lambda x: x.split("||")[0])

# convert the timestamp in the transcriptArr to a GET
for i in range(len(transcriptArr)):
    transcriptArr[i] = transcriptArr[i].replace(transcriptArr[i].split("||")[0], GETFromSeconds(int(transcriptArr[i].split("||")[0])))

# write the transcript to a file
with open(f"{inputPath}_transcript.csv", "w", encoding="utf-8") as out:
    out.write("\n".join(transcriptArr))
