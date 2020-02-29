import csv
import json
import os

# This script is step 3of3 after running write_audiowaveform_tape_json.py which creates the input files
# for this script
# This script creates channel activity from 1-60 by GET, discarding HR1 HR2 tape information. This json is consumed by
# javascript to display the tape channel activity


def getsec(s):
    l = s.split(':')
    if l[0][0:1] != "-":
        return int(l[0]) * 3600 + int(l[1]) * 60 + int(l[2])
    else:
        return int(l[0]) * 3600 + (int(l[1]) * 60 * -1) + (int(l[2]) * -1)

# root_path = "F:/mp3/"
# root_path = "H:/A13_mp3/"
root_path = "O:/Apollo_13_30-Track/44.1/A13_mp3/"

# load and sort tape ranges per HR
HR1_tape_ranges = []
HR2_tape_ranges = []

inputFilePath = "../../_website/_webroot/13/MOCRviz/data/tape_ranges.csv"
reader = csv.reader(open(inputFilePath, "rU"), delimiter='|')
for row in reader:
    if "HR1" in row[1]:
        HR1_tape_ranges.append([row[0], row[1], getsec(row[2]), row[2], row[3]])
    else:
        HR2_tape_ranges.append([row[0], row[1], getsec(row[2]), row[2], row[3]])

HR1_tape_ranges.sort(key=lambda x: x[2])
HR2_tape_ranges.sort(key=lambda x: x[2])

start_GETseconds = HR1_tape_ranges[0][2]
end_GETseconds = getsec(HR1_tape_ranges[len(HR1_tape_ranges)-1][4])

# add a fake last item to each array that contains a start time.
# This start time is the end time of the last tape
HR1_tape_ranges.append(['', '', end_GETseconds])
HR2_tape_ranges.append(['', '', end_GETseconds])

# range(start_GETseconds, end_GETseconds):
# currHR1 = getTapeByGET(GET, 'HR1')
# currHR2 = getTapeByGET(GET, 'HR2')

#make giant activity arrays
HR1_complete_activity = [[]]
for idx, val in enumerate(HR1_tape_ranges):
    try:
        tapeActivityArrayIndexStart = 0
        tapeActivityArrayIndexEnd = HR1_tape_ranges[idx + 1][2] - HR1_tape_ranges[idx][2]
        tapeActivityJSONPath = (root_path + 'DA13_' + val[0] + '_' + val[1] +'_16khz_mp3_16/' + 'DA13_' + val[0] + '_' + val[1] +'_16khz_mp3_16noiseranges.json')
        with open(tapeActivityJSONPath) as json_data:
            tapeData = json.load(json_data)
    except:
        break
    HR1_complete_activity.extend(tapeData[tapeActivityArrayIndexStart:tapeActivityArrayIndexEnd])
    print("HR1 processed " + val[0] + " items: " + str(tapeActivityArrayIndexEnd - tapeActivityArrayIndexStart))
    if tapeActivityArrayIndexEnd > len(tapeData):  # extend dataset with silence if noise ends before end of file. This maintains 1 array element per second
        padding = tapeActivityArrayIndexEnd - len(tapeData) + 1
        print("HR1 " + val[0] + " padded with " + str(padding))
        HR1_complete_activity.extend([ [] for i in range(padding)])

HR2_complete_activity = []
for idx, val in enumerate(HR2_tape_ranges):
    try:
        tapeActivityArrayIndexStart = 0
        tapeActivityArrayIndexEnd = HR2_tape_ranges[idx + 1][2] - HR2_tape_ranges[idx][2]
        tapeActivityJSONPath = (root_path + 'DA13_' + val[0] + '_' + val[1] +'_16khz_mp3_16/' + 'DA13_' + val[0] + '_' + val[1] +'_16khz_mp3_16noiseranges.json')
        with open(tapeActivityJSONPath) as json_data:
            tapeData = json.load(json_data)
    except:
        break
    HR2_complete_activity.extend(tapeData[tapeActivityArrayIndexStart:tapeActivityArrayIndexEnd])
    print("HR2 processed " + val[0] + " items: " + str(tapeActivityArrayIndexEnd - tapeActivityArrayIndexStart))
    if tapeActivityArrayIndexEnd > len(tapeData): # extend dataset with silence if noise ends before end of file. This maintains 1 array element per second
        padding = tapeActivityArrayIndexEnd - len(tapeData) + 1
        print("HR2 " + val[0] + " padded with " + str(padding))
        HR2_complete_activity.extend([ [] for i in range(padding)])

# merge two complete activity arrays and renumber HR2 numbers
complete_activity = []
HR2_nested_item = []
complete_activity_item = []
for i in range(len(HR1_complete_activity)):
    HR2_nested_item.clear()
    for val in HR2_complete_activity[i]:
        HR2_nested_item.append(val + 30)

    complete_activity_item = HR1_complete_activity[i] + HR2_nested_item
    complete_activity.append(complete_activity_item.copy())

os.makedirs(root_path + 'tape_activity')

lastIterativeItem = 0
for i in range(1000, len(complete_activity), 1000):
    filename = 'tape_activity_' + str(lastIterativeItem) + '-' + str(i - 1) + '.json'
    with open(root_path + 'tape_activity/' + filename, 'w') as outfile:
        json.dump(complete_activity[lastIterativeItem:i], outfile)
    lastIterativeItem = i

filename = 'tape_activity_' + str(lastIterativeItem) + '-' + str(len(complete_activity)) + '.json'
with open(root_path + 'tape_activity/' + filename, 'w') as outfile:
    json.dump(complete_activity[lastIterativeItem:len(complete_activity)], outfile)

# with open('F:/mp3/tape_activity.json', 'w') as outfile:
#     json.dump(complete_activity, outfile)
#     # print(json.dumps({"channelsInSeconds": secondsChannelArray}, indent=3))
print('done')

