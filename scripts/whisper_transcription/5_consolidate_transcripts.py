import os

inputPath = "F:/A13_MOCR_transcription/transcripts/"
outputPath = "F:/A13_MOCR_transcription/transcripts/"


def timeIdToGET(timeId):
    # timeId.substr(0, 3) + ":" + timeId.substr(3, 2) + ":" + timeId.substr(5, 2);
    return timeId[0:3] + ":" + timeId[3:5] + ":" + timeId[5:7]


def timeIdToSeconds(timeId):
    if timeId[0] == "-":
        timeId = "0" + timeId[1:]
        negative = True
    else:
        negative = False

    hours = int(timeId[0:3])
    minutes = int(timeId[2:4])
    seconds = int(timeId[4:6])
    totalSeconds = (abs(hours) * 60 * 60) + minutes * 60 + seconds
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

    if not file.endswith(".txt"):
        continue
    print("Processing " + file)

    # match the track number from the filename
    channel = int(file.split("_")[0].replace("CH", ""))

    with open(f"{inputPath}{file}", "r", encoding="utf-8") as f:
        lines = f.readlines()

        for line in lines:
            [timeId, content] = line.split("|")
            transcript.append(f"{timeIdToSeconds(timeId)}|{timeIdToGET(timeId)}|{channel}|{content}")
            totalUtterances += 1
            # count the number of words
            totalWords += len(content.split(" "))

print(f"Total utterances: {totalUtterances}")
print(f"Total words: {totalWords}")

print("Sorting transcript")
# sort the transcript by timestamp and channel
transcript.sort(key=lambda x: (int(x.split("|")[0]), int(x.split("|")[2])))

print("Writing transcript to file")
# write the transcript to a file
with open(f"{outputPath}allChannelsTranscript.txt", "w", encoding="utf-8") as f:
    for line in transcript:
        [seconds, timestamp, channel, content] = line.split("|")
        f.write(f"{timestamp}|{channel}|{content}")

print("Zipping transcript file")
# zip the transcript file
os.system(f"7z a -tzip {outputPath}allChannelsTranscript.zip {outputPath}allChannelsTranscript.txt")

print("Deleting transcript file")
# delete the transcript file
# os.remove(f"{outputPath}allChannelsTranscript.txt")

print("Done")
