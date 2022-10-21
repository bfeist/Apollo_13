
import re
import os
import tape_info


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
    minutes = int(values[0])
    seconds = int(values[1])
    milliseconds = int(values[2])
    return round((minutes * 60) + seconds + (milliseconds / 1000))


def showUtteranceGET(tapeStart, wavStart, vttTimestamp):
    return GETFromSeconds(secondsFromGET(tapeStart) + wavStart + nearestSecondFromVTTTimestamp(vttTimestamp))


inputPath = "K:/tempK/whisper/"

vtts = []
for tape in os.listdir(inputPath):
  if os.path.isdir(os.path.join(inputPath,tape)):  
    print("Processing Tape: " + tape)
    if not "HR2" in tape:
      continue
    
    for trackFolder in os.listdir(os.path.join(inputPath, tape)):
      if not "CH20" in trackFolder:
        continue
      else:        
        for filename in os.listdir(os.path.join(inputPath, tape, trackFolder, "transcripts")):
            if filename.endswith(".vtt"):
                filenameWithPath = os.path.join(inputPath, tape, trackFolder, "transcripts", filename)
                vtts.append(f"{filenameWithPath}")



transcriptArr = []
for vtt in vtts:
    tapeStart = tape_info.getTapeStartByFilename(vtt)
    # vtt = "DA13_T709_HR2L_CH20__9851_9864.wav.vtt"
    with open(f"{vtt}", "r", encoding="utf-8") as f:
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
transcriptArr.sort(key=lambda x: int(x.split("||")[0]))

# convert the timestamp in the transcriptArr to a GET
for i in range(len(transcriptArr)):
    transcriptArr[i] = transcriptArr[i].replace(transcriptArr[i].split("||")[0], GETFromSeconds(int(transcriptArr[i].split("||")[0])))

# write the transcript to a file
with open(f"{inputPath}_CH20_transcript.csv", "w", encoding="utf-8") as out:
    out.write("\n".join(transcriptArr))
