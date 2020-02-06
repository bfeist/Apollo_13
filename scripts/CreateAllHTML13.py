import csv
import operator
from quik import FileLoader
import re

# -------------------- Write Utterance Data
output_utterance_data_file_name_and_path = "../_website/_webroot/13/indexes/utteranceData.csv"
output_utterance_data_file = open(output_utterance_data_file_name_and_path, "w")
output_utterance_data_file.write("")
output_utterance_data_file.close()
output_utterance_data_file = open(output_utterance_data_file_name_and_path, "a")

# Read all utterances into a list
cur_row = 0
input_file_path = "../MISSION_DATA/A13_utterances.csv"
utterance_reader = csv.reader(open(input_file_path, "rU"), delimiter='|')
lasttimestamp = ''
lastwho = ''
utteranceLines = []
for utterance_row in utterance_reader:
    cur_row += 1
    timeline_index_id = utterance_row[0].replace(":", "")
    if utterance_row[1] != "":  # if not a TAPE change or title row
        words_modified = utterance_row[3]
        who_modified = utterance_row[2]
        if timeline_index_id == lasttimestamp and who_modified == lastwho:
            pass
        else:
            utteranceLines.append(timeline_index_id + "|" + who_modified + "|" + words_modified + '|' + utterance_row[1] + "\n")
        lasttimestamp = timeline_index_id
        lastwho = who_modified
    # print(cur_row)

# Read all FD loop utterances into a similar list
fdFile = open("../MISSION_DATA/flight-director-loop.txt", "r")
fdLines = []
whoWhenGathered = False
timeline_index_id = ''
who_modified = ''
# counter = 0
for fdLine in fdFile:
    # counter += 1
    # if counter == 356:
    #     print('break here')
    if fdLine[0:1] != ">" and fdLine[1:2] != '>':  #filter out comments.
        fdLine.replace('[- ', '[') #convert timestamps that only have concluding times to make those the utterance times
        match = re.search(r'\[(\d\d \d\d \d\d).*?\] (.*)', fdLine)
        if match is not None:  #if on when / who line
            timeline_index_id = '0' + match.group(1).replace(" ", "")
            who_modified = match.group(2)
        elif len(fdLine) > 1:
            words_modified = fdLine.strip()
            fdLines.append(timeline_index_id + "|" + who_modified + "|" + words_modified + '|' + 'F' + "\n")


# turn timestamps into integers for sorting (to accomodate negative numbers)
all_utterances_list = utteranceLines.copy() + fdLines.copy()
sortableUtteranceList = []
for line in all_utterances_list:
    tempList = []
    if line.split('|')[0] != '':
        timestampInt = int(line.split('|')[0])
    else:
        print('empty timestamp on line: ' + line)
    tempList.append(timestampInt)
    tempList.append(line)
    sortableUtteranceList.append(tempList.copy())

# merge two utterances and FD utterances into one list, sort it, and write to file
sortableUtteranceList.sort(key = lambda x: x[0]) #sort using first element of nest list (the integer timestamp)
for item in sortableUtteranceList:
    output_utterance_data_file.write(item[1])
output_utterance_data_file.close()


# -------------------- WRITE ALL commentary ITEMS
output_commentary_data_file_name_and_path = "../_website/_webroot/13/indexes/commentaryData.csv"
output_commentary_data_file = open(output_commentary_data_file_name_and_path, "w")
output_commentary_data_file.write("")
output_commentary_data_file.close()
output_commentary_data_file = open(output_commentary_data_file_name_and_path, "a")

cur_row = 0
input_file_path = "../MISSION_DATA/A13_commentary.csv"
commentary_reader = csv.reader(open(input_file_path, "rU"), delimiter='|')
for commentary_row in commentary_reader:
    cur_row += 1
    timeid = commentary_row[0].replace(":", "")
    # if commentary_row[1] == "ALSJ" and commentary_row[2] == "":
    #     pass
    # else:
    # if commentary_row[1] == "ALSJ":
    #     commentary_row[1] = "";
    # print(str(cur_row) + " " + timeid + "|" + commentary_row[1])
    output_commentary_data_file.write(
        # timeid + "|" + commentary_row[1] + "|" + commentary_row[2] + "|" + commentary_row[3] + "\n")
        timeid + "|" + commentary_row[1] + "\n")
output_commentary_data_file.close()


# --------------------------------- Write photo index
output_photo_index_file_name_and_path = "../_website/_webroot/13/indexes/photoData.csv"
output_photo_index_file = open(output_photo_index_file_name_and_path, "w")
output_photo_index_file.write("")
output_photo_index_file.close()

output_photo_index_file = open(output_photo_index_file_name_and_path, "a")

photo_list = []
tempRecord = []
input_file_path = "../MISSION_DATA/A13_photos.csv"
photos_reader = csv.reader(open(input_file_path, "rU"), delimiter='|')
for photo_row in photos_reader:
    tempRecord.clear()
    if photo_row[0] != "" and photo_row[0] != "skip":  # if timestamp not blank and photo not marked to skip
        tempRecord.append(int(photo_row[0].replace(":", "")))  #integer photo id for sorting
        tempRecord.append(photo_row[0].replace(":", ""))  #photo_index_id
        tempRecord.append(photo_row[1])  #photo_name
        tempRecord.append(photo_row[2])  #photo_filename
        tempRecord.append(photo_row[3])  #custom_url
        if photo_row[4].startswith('"') and photo_row[4].endswith('"'):
            caption = photo_row[4][1:len(photo_row[4]) - 1].replace('""', '"')
        else:
            caption = photo_row[4]
        tempRecord.append(caption)
        photo_list.append(tempRecord.copy())

sorted_list = sorted(photo_list, key=operator.itemgetter(0))


for list_item in sorted_list:
    outputLine = '{0}|{1}|{2}|{3}|{4}\n'.format(list_item[1], list_item[2], list_item[3], list_item[4], list_item[5])
    output_photo_index_file.write(outputLine)
output_photo_index_file.close()


# -------------------- Write TOC
template_loader = FileLoader('./templates')

output_TOC_file_name_and_path = "../_website/_webroot/13/TOC.html"
output_TOC_file = open(output_TOC_file_name_and_path, "w")
output_TOC_file.write("")
output_TOC_file.close()

output_TOC_file = open(output_TOC_file_name_and_path, "ab")

output_TOC_index_file_name_and_path = "../_website/_webroot/13/indexes/TOCData.csv"
output_TOC_index_file = open(output_TOC_index_file_name_and_path, "w")
output_TOC_index_file.write("")
output_TOC_index_file.close()

output_TOC_index_file = open(output_TOC_index_file_name_and_path, "a")


# WRITE HEADER
template = template_loader.load_template('template_TOC_header.html')
output_TOC_file.write(template.render({'datarow': 0}, loader=template_loader).encode('utf-8'))

# WRITE TOC ITEMS
prev_depth = 0
depth_comparison = "false"
timestamp = ""
inputFilePath = "../MISSION_DATA/A13_TOC.csv"
csv.register_dialect('pipes', delimiter='|', doublequote=True, escapechar='\\')
reader = csv.reader(open(inputFilePath, "rU"), dialect='pipes')
for row in reader:
    timestamp = row[0]
    timeline_index_id = row[0].replace(":", "")
    item_depth = row[1]
    if int(item_depth) < int(prev_depth):
        depth_comparison = "true"
    else:
        depth_comparison = "false"
    item_title = row[2]
    item_URL = timestamp.replace(":", "")
    toc_index_id = timestamp.replace(":", "")
    template = template_loader.load_template('template_TOC_item.html')
    output_TOC_file.write(template.render(
        {'timestamp': timestamp, 'itemDepth': item_depth, 'prevDepth': prev_depth, 'itemTitle': item_title,
         'itemURL': item_URL, "depthComparison": depth_comparison}, loader=template_loader).encode('utf-8'))
    prev_depth = item_depth
    output_TOC_index_file.write(timeline_index_id + "|" + item_depth + "|" + item_title + "\n")

# WRITE FOOTER
template = template_loader.load_template('template_TOC_footer.html')
output_TOC_file.write(template.render({'datarow': 0}, loader=template_loader).encode('utf-8'))

