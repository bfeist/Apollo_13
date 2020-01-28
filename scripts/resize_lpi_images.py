__author__ = 'Feist'
import csv
import re
import os, sys
from PIL import Image

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

        outputPath = outputDest + '/medium/AS13/' + rollNum + '/'
        if not os.path.isdir(outputDest + '/medium'):
            os.mkdir(outputDest + '/medium')
        if not os.path.isdir(outputDest + '/medium/AS13'):
            os.mkdir(outputDest + '/medium/AS13')
        if not os.path.isdir(outputPath):
            os.mkdir(outputPath)

        inputFile = outputDest + '/print/AS13/' + rollNum + '/' + imgNum + '.jpg'

        if not os.path.isfile(outputPath + imgNum + '.jpg'):
            print('resizing: ' + outputPath + imgNum + '.jpg')
            try:
                basewidth = 1280
                img = Image.open(inputFile)
                wpercent = (basewidth/float(img.size[0]))
                hsize = int((float(img.size[1])*float(wpercent)))
                img = img.resize((basewidth,hsize), Image.ANTIALIAS)
                img.save(outputPath + imgNum + '.jpg')
            except IOError:
                print("cannot create thumbnail for '%s'" % inputFile)
        else:
            print('skipping: ' + outputPath + imgNum + '.jpg')
