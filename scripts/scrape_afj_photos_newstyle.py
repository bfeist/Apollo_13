__author__ = 'Feist'
import requests
import re

urlArray = ["00_crewchange.html", "01launch_ascent.html", "02earth_orbit_tli.html",
            "03tde.html", "04day1-end.html", "05day2-mcc2-tv.html", "06day2-end.html",
            "07day3-before-the-storm.html", "08day3-problem.html", "09day3-lifeboat.html",
            "10day3-free-return.html", "11day3-minimise-power.html", "12day4-approach-moon.html",
            "13day4-leaving-moon.html", "14day4-homeward.html", "15day4-mailbox.html",
            "16day4-checkingodyssey.html", "17day5-thumpandsnowflakes.html", "18day5-feelingthecold.html",
            "19day5-themanualcoursecorrection.html", "20day5-wobblesandbursts.html",
            "21day5-batterycharge.html", "22day6-packingup.html", "23day6-thereactivationchecklist.html",
            "24day6-wornoutcrew.html", "25day6-thelastcoursecorrection.html", "26day6-servicemoduleseparation.html",
            "27day6-odysseyresurrected.html", "28day6-farewellaquarius.html", "29day6-returnhome.html",
            "30postflight.html"]

# urlArray = ["01launch_ascent.html"]

outputFilePath = "../MISSION_DATA/scraped_data/scraped_photoinfo_AFJ_newstyle.csv"
outputFile = open(outputFilePath, "w")
outputFile.write("")
outputFile.close()
outputFile = open(outputFilePath, "a")

for url in urlArray:
    # request = requests.get('https://history.nasa.gov/afj/ap13fj/' + url)
    # pageAscii = request.text.encode('ascii', 'ignore').decode('ascii')
    # lines = pageAscii.split("\r\n")
    data = open('../ap13fj/' + url, 'r')
    pageAscii = data.read()
    lines = pageAscii.split("\n")

    timestamp = ''
    photosection = False
    linecounter = 0

    for line in lines:
        linecounter += 1
        if linecounter == 608:
            print('test area')
        line_match = re.search(r'(\d{3}:\d{2}:\d{2})', line)
        if line_match is not None:
            timestamp = line_match.group(1)

        timestamp_match = re.search(r'<b>T-(\d{3}:\d{2}:\d{2})', line)
        if timestamp_match is not None:
            timestamp = "-" + timestamp_match.group(1)[1:]

        if photosection:
            big_photo_match = re.search(r'href="(.*)" target="_blank"', line)
            if big_photo_match is not None:
                big_photo_url = big_photo_match.group(1)
                if big_photo_url[:4] != 'http':
                    big_photo_url = 'https://history.nasa.gov/afj/ap13fj/' + big_photo_url

            photo_match = re.search(r'<img src="(.*.(jpg|png))"', line)
            if photo_match is not None:
                sm_photo_url = photo_match.group(1)
                if sm_photo_url[:4] != 'http':
                    sm_photo_url = 'https://history.nasa.gov/afj/ap13fj/' + sm_photo_url

            caption_match = re.search(r'<div class="caption">(.*)</div>', line)
            if caption_match is not None:
                if " - " in caption_match.group(1):
                    captionObj = caption_match.group(1).split(' - ')
                    photoname = captionObj[0]
                    caption = captionObj[1]
                else:
                    photoname = ''
                    caption = caption_match.group(1)

                print(str(linecounter) + " timestamp: " + timestamp + " photoname: " + photoname + " small: " + sm_photo_url + " big: " + big_photo_url + " caption: " + caption)
                outputFile.write(timestamp + "|" + photoname + "|" + sm_photo_url + "|" + big_photo_url + "|" + caption + "\n")
                photosection = False

        photosection_match = re.search(r'<div class="photo">', line)
        if photosection_match is not None:
            photosection = True
            big_photo_url = ''
            sm_photo_url = ''

    print("************* DONE page:", url)
outputFile.close()
