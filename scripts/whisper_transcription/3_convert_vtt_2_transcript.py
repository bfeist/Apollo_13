import re
import os


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


def nearestSecondFromVTTTimestamp(timestamp):
    temp = timestamp.replace(".", ":")
    values = re.split(r":", temp)
    if len(values) == 4:
        hours = int(values[0])
        minutes = int(values[1])
        seconds = int(values[2])
        milliseconds = int(values[3])
        if milliseconds > 500:
            seconds += 1
        return round((hours * 60 * 60) + (minutes * 60) + seconds)

    minutes = int(values[0])
    seconds = int(values[1])
    milliseconds = int(values[2])
    if milliseconds > 500:
        seconds += 1
    return round((minutes * 60) + seconds)


def showUtteranceGET(tapeStart, wavStart, vttTimestamp):
    return GETFromSeconds(secondsFromGET(tapeStart) + wavStart + nearestSecondFromVTTTimestamp(vttTimestamp))


def getTapeStart(fullVttPath):
    for tape in tapeRanges:
        if tape["name"] in fullVttPath:
            return tape["start"]
    return None


inputPath = "F:/A13_MOCR_transcription/"
tapeRangesPath = "D:/Apollo_13/_website/_webroot/13/MOCRviz/data/tape_ranges.csv"

# Read in the tape ranges csv file
tapeRanges = []
with open(tapeRangesPath, "r") as tapeRangesFile:
    for line in tapeRangesFile:
        values = re.split(r"\|", line)
        tapeRanges.append({"name": values[0], "type": values[1], "start": values[2], "end": values[3].strip})


# Convert each track across tapes into a single transcript accounting for HR1 or HR2 tape types
tapeNames = []
for tapeType in ["HR1", "HR2"]:
    if tapeType == "HR1":
        tapeNames = [tape["name"] for tape in tapeRanges if "HR1" in tape["type"]]
    else:
        tapeNames = [tape["name"] for tape in tapeRanges if "HR2" in tape["type"]]

    print("Processing " + tapeType + " tapes")
    for track in range(2, 31):
        # if the transcript for this track already exists, skip it
        # if os.path.exists(f"{inputPath}_raw_transcripts/{tapeType}_CH{track}_transcript.txt"):
        #     print(f"Transcript for {tapeType} CH{track} already exists, skipping")
        #     continue
        print("Processing " + tapeType + " track " + str(track))

        vtts = []
        for tape in os.listdir(inputPath):
            if not os.path.isdir(os.path.join(inputPath, tape)):
                continue
            if not tape.startswith("DA13"):
                continue
            tapeNumber = re.search(r"(T\d\d\d)", tape).group(1)
            if not tapeNumber in tapeNames:
                continue

            print(f"Reading VTTs: {tapeType} CH{track} - {tape}")
            for trackFolder in os.listdir(os.path.join(inputPath, tape)):
                if not f"CH{track}." in trackFolder:
                    continue
                else:
                    if not os.path.isdir(os.path.join(inputPath, tape, trackFolder, "transcripts")):
                        print("No transcription folder, skipping")
                        continue
                    for filename in os.listdir(os.path.join(inputPath, tape, trackFolder, "transcripts")):
                        if not filename.endswith(".vtt"):
                            continue
                        filenameWithPath = os.path.join(inputPath, tape, trackFolder, "transcripts", filename)
                        vtts.append(f"{filenameWithPath}")

        print(f"Total VTT transcript files for {tapeType} CH{track} across mission: {len(vtts)}\n")
        if len(vtts) == 0:
            print("No VTT files found, skipping")
            continue

        print("Process all vtts for this track across all tapes of tapeType")
        transcriptArr = []
        for vtt in vtts:
            tapeStart = getTapeStart(vtt)
            with open(f"{vtt}", "r", encoding="utf-8") as f:
                # print(f"Processing {vtt}")
                lines = f.readlines()

                wavStart = int(re.search(r"__(\d*)_", vtt).group(1))

                currentStart = ""
                uttStart = ""
                utterance = ""
                for line in lines:
                    if re.match(r"^\n", line) or line.rstrip() == "WEBVTT":
                        continue
                    if re.match(r"((\d\d:)?\d\d:\d\d.\d\d\d) --> ((\d\d:)?\d\d:\d\d.\d\d\d)", line):
                        currentStart = line.split(" --> ")[0]
                    else:
                        if len(utterance) > 0:
                            utterance = utterance + " " + line.rstrip()

                        else:
                            uttStart = currentStart
                            utterance = line.rstrip()

                        # if the current line ends with a punctuation mark
                        # Or if the line is over 500 characters long
                        # Write the line to the output file.
                        if re.match(r".*[.?!…]$", line) or len(utterance) > 500:
                            seconds = secondsFromGET(tapeStart) + wavStart + nearestSecondFromVTTTimestamp(uttStart)
                            transcriptArr.append(f"{seconds}||{utterance}")
                            utterance = ""

        print(f"Total utterances for {tapeType} CH{track} across mission: {len(transcriptArr)}\n")
        # sort the transcriptArr by the timestamp
        transcriptArr.sort(key=lambda x: int(x.split("||")[0]))

        # convert the timestamp in the transcriptArr to a GET
        for i in range(len(transcriptArr)):
            transcriptArr[i] = transcriptArr[i].replace(
                transcriptArr[i].split("||")[0], GETFromSeconds(int(transcriptArr[i].split("||")[0]))
            )

        # create the output folder if it doesn't exist
        if not os.path.exists(f"{inputPath}_raw_transcripts"):
            os.mkdir(f"{inputPath}_raw_transcripts")

        # write the transcript to a file
        with open(f"{inputPath}_raw_transcripts/{tapeType}_CH{track}_transcript.txt", "w", encoding="utf-8") as out:
            out.write("\n".join(transcriptArr))
