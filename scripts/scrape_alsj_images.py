__author__ = 'Feist'
import csv
import urllib.request
import re
import os

mission_images = []

outputDest = "F:/alsj_mirror"

inputFilePath = "..\\MISSION_DATA\\A13_photos.csv"
reader = csv.reader(open(inputFilePath, "rU"), delimiter='|')
for row in reader:
    if row[2] != '' and row[0] != 'skip':
        mission_images.append([row[0], row[1], row[2], row[3], row[4]])

for imageitem in mission_images:

        outputPath = outputDest + '/' + imageitem[2]
        imageURL = 'https://www.hq.nasa.gov/alsj/a13/' + imageitem[2]
        if not os.path.isfile(outputPath):
            print('downloading: ' + outputPath)
            urllib.request.urlretrieve(imageURL, outputPath)
        else:
            print('skipping: ' + outputPath)
