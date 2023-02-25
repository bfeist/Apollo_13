import os

inputPath = "F:/A13_MOCR_transcription/transcripts/"
outputPath = "F:/A13_MOCR_transcription/transcripts/"


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


def secondsFromTimeId(timeId):
    if timeId[0] == "-":
        timeId = "0" + timeId[1:]
        negative = True
    else:
        negative = False

    hours = int(timeId[0:3])
    minutes = int(timeId[2:4])
    seconds = int(timeId[4:6])
    totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds
    if negative:
        totalSeconds = totalSeconds * -1
    return totalSeconds


# consolidate all transcripts into a single file
transcript = []
totalUtterances = 0
totalWords = 0
for file in os.listdir(inputPath):
    if "CH" not in file:
        continue
    print("Processing " + file)
    if not file.endswith(".txt"):
        continue

    print("Processing " + file)

    # match the track number from the filename
    channel = int(file.split("_")[0].replace("CH", ""))

    with open(f"{inputPath}{file}", "r", encoding="utf-8") as f:
        lines = f.readlines()

        for line in lines:
            [timeId, content] = line.split("|")
            transcript.append(f"{secondsFromTimeId(timeId)}|{channel}|{content}")
            totalUtterances += 1
            # count the number of words
            totalWords += len(content.split(" "))

print(f"Total utterances: {totalUtterances}")
print(f"Total words: {totalWords}")

print("Sorting transcript")
# sort the transcript by timestamp and channel
transcript.sort(key=lambda x: (int(x.split("|")[0]), int(x.split("|")[1])))

print("Writing transcript to file")
# write the transcript to a file
with open(f"{outputPath}allChannelsTranscript.txt", "w", encoding="utf-8") as f:
    for line in transcript:
        [timestamp, channel, content] = line.split("|")
        f.write(f"{GETFromSeconds(int(timestamp))}|{channel}|{content}")

print("Zipping transcript file")
# zip the transcript file
os.system(f"7z a -tzip {outputPath}allChannelsTranscript.zip {outputPath}allChannelsTranscript.txt")

print("Deleting transcript file")
# delete the transcript file
# os.remove(f"{outputPath}allChannelsTranscript.txt")

print("Done")
