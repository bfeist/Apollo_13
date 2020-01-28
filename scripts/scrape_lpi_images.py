__author__ = 'Feist'
import csv
import urllib.request
import re
import os

mission_images = []

outputDest = "F:/lpi_mirror"

inputFilePath = "..\\MISSION_DATA\\A13_photos.csv"
reader = csv.reader(open(inputFilePath, "rU"), delimiter='|')
for row in reader:
    if row[1].startswith('AS13'):
        mission_images.append([row[0], row[1], row[2], row[3], row[4]])

for imageitem in mission_images:
    filename_match = re.search(r'AS13-(\d\d)-(\d\d\d\d.?)', imageitem[1])
    if filename_match is not None:
        rollNum = filename_match.group(1)
        imgNum = filename_match.group(2)

        outputPath = outputDest + '/thumb/AS13/' + rollNum + '/'
        if not os.path.isdir(outputDest + '/thumb'):
            os.mkdir(outputDest + '/thumb')
            if not os.path.isdir(outputDest + '/thumb/AS13'):
                os.mkdir(outputDest + '/thumb/AS13')
        if not os.path.isdir(outputPath):
            os.mkdir(outputPath)
        imageURL = 'https://www.lpi.usra.edu/resources/apollo/images/thumb/AS13/' + rollNum + '/' + imgNum + '.jpg';
        if not os.path.isfile(outputPath + imgNum + '.jpg'):
            print('downloading: ' + outputPath + imgNum + '.jpg')
            urllib.request.urlretrieve(imageURL, outputPath + imgNum + '.jpg')
        else:
            print('skipping: ' + outputPath + imgNum + '.jpg')

for imageitem in mission_images:
    filename_match = re.search(r'AS13-(\d\d)-(\d\d\d\d.?)', imageitem[1])
    if filename_match is not None:
        rollNum = filename_match.group(1)
        imgNum = filename_match.group(2)

        outputPath = outputDest + '/browse/AS13/' + rollNum + '/'
        if not os.path.isdir(outputDest + '/browse'):
            os.mkdir(outputDest + '/browse')
            if not os.path.isdir(outputDest + '/browse/AS13'):
                os.mkdir(outputDest + '/browse/AS13')
        if not os.path.isdir(outputPath):
            os.mkdir(outputPath)
        imageURL = 'https://www.lpi.usra.edu/resources/apollo/images/browse/AS13/' + rollNum + '/' + imgNum + '.jpg';
        if not os.path.isfile(outputPath + imgNum + '.jpg'):
            print('downloading: ' + outputPath + imgNum + '.jpg')
            urllib.request.urlretrieve(imageURL, outputPath + imgNum + '.jpg')
        else:
            print('skipping: ' + outputPath + imgNum + '.jpg')

for imageitem in mission_images:
    filename_match = re.search(r'AS13-(\d\d)-(\d\d\d\d.?)', imageitem[1])
    if filename_match is not None:
        rollNum = filename_match.group(1)
        imgNum = filename_match.group(2)

        outputPath = outputDest + '/print/AS13/' + rollNum + '/'
        if not os.path.isdir(outputDest + '/print'):
            os.mkdir(outputDest + '/print')
            if not os.path.isdir(outputDest + '/print/AS13'):
                os.mkdir(outputDest + '/print/AS13')
        if not os.path.isdir(outputPath):
            os.mkdir(outputPath)
        imageURL = 'https://www.lpi.usra.edu/resources/apollo/images/print/AS13/' + rollNum + '/' + imgNum + '.jpg';
        if not os.path.isfile(outputPath + imgNum + '.jpg'):
            print('downloading: ' + outputPath + imgNum + '.jpg')
            urllib.request.urlretrieve(imageURL, outputPath + imgNum + '.jpg')
        else:
            print('skipping: ' + outputPath + imgNum + '.jpg')
