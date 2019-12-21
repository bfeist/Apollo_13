import csv

class PrevTimestamp:
    def __init__(self, line, intTimestamp, strTimestamp):
        self.line = line
        self.intTimestamp = intTimestamp
        self.strTimestamp = strTimestamp

curRow = 0
prevTimestamp = 0
strippedTimestamp = ""
missingAudioFlag = 0
prevRowTimestamps = []
numPrevTimestampsToTrack = 6

#init prevTimestamps array
tsObj = PrevTimestamp(0,0,"")
for _ in range(0, numPrevTimestampsToTrack):
    prevRowTimestamps.append(tsObj)

for curFile in [ "A13_utterances.csv" ]:
    inputFilePath = "..\..\MISSION_DATA\\" + curFile
    reader = csv.reader(open(inputFilePath, "rU"), delimiter='|')
    for row in reader:
        curRow += 1
        # print (curRow)
        if row[0].__len__() > 9:
            print(curRow)
            print("------------- timestamp too long: " + row[0])

        strippedTimestamp = row[0].replace(":", "") # remove colons
        if strippedTimestamp != "" and int(strippedTimestamp) > 0 : # don't analyze tape change lines (blank timestamp) or pre-launch segment
            if int(strippedTimestamp) < prevRowTimestamps[0].intTimestamp:
                print("Timestamp order error on line: " + str(curRow))

            # update the list of the previous x timecodes
            prevRowTimestamps.insert(0 , PrevTimestamp(curRow, int(strippedTimestamp), row[1]))
            del prevRowTimestamps[numPrevTimestampsToTrack] #delete the previously last element in the list

        # if curRow > 10000:
        #    break
print("DONE")