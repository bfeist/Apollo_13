__author__ = 'Feist'
import requests
import re


def cleanseString(str):
    result = re.sub('<a name=".*"></a>', '', str)
    result = re.sub(' +', ' ', result).strip()
    return result


urlArray = ["01launch_ascent.html", "02earth_orbit_tli.html",
            "03tde.html", "04day1-end.html", "05day2-mcc2-tv.html",
            "06day2-end.html", "07day3-before-the-storm.html",
            "08day3-problem.html", "09day3-lifeboat.html",
            "10day3-free-return.html", "11day3-minimise-power.html",
            "12day4-approach-moon.html", "13day4-leaving-moon.html"]

# urlArray = ["01launch_ascent.html"]

outputFilePath = "../MISSION_DATA/scraped_data/scraped_commentary_AFJ_fromnewstyle.csv"
outputFile = open(outputFilePath, "w")
outputFile.write("")
outputFile.close()
outputFile = open(outputFilePath, "a")

for url in urlArray:
    request = requests.get('https://history.nasa.gov/afj/ap13fj/' + url)
    pageAscii = request.text.encode('ascii', 'ignore').decode('ascii')
    lines = pageAscii.split("\r\n")

    timestamp = ''
    commentary = ''
    linecounter = 0
    commentary_multiline_started = False

    for line in lines:
        linecounter += 1
        if linecounter == 667:
            print('test area')
        timestamp_match = re.search(r'<b>(\d{3}:\d{2}:\d{2})', line)
        if timestamp_match is not None:
            timestamp = timestamp_match.group(1)
            # timestamp = timestamp[0:3] + ":" + timestamp[3:5] + ":" + timestamp[5:7]

        timestamp_match = re.search(r'a name="(-\d{7})"', line)
        if timestamp_match is not None:
            timestamp = timestamp_match.group(1)
            timestamp = "-" + timestamp[2:4] + ":" + timestamp[4:6] + ":" + timestamp[6:8]

        if commentary_multiline_started:
            commentary_closing_match = re.search(r'(.*)</div>', line)
            if commentary_closing_match is not None:
                commentary += commentary_closing_match.group(1).strip() + " "
                commentary_multiline_started = False
                commentary = cleanseString(commentary)
                print(str(linecounter) + " GET: " + timestamp + " Commentary: " + commentary)
                outputFile.write(timestamp + "|" + commentary + "\n")
                commentary = ''
            else:
                commentary += line.strip() + " "

        commentary_match = re.search(r'<div class="comment">(.*)', line)
        if commentary_match is not None:
            commentary_single_line_match = re.search(r'<div class="comment">(.*)</div>', line)
            if commentary_single_line_match is not None:
                if 'omm break.' not in commentary_single_line_match.group(1):
                    commentary = commentary_single_line_match.group(1).strip()
                    commentary = cleanseString(commentary)
                    print(str(linecounter) + " GET: " + timestamp + " Commentary: " + commentary)
                    outputFile.write(timestamp + "|" + commentary + "\n")
                    commentary = ''
            else:
                commentary_multiline_started = True
                commentary += commentary_match.group(1).strip() + " "

    print("************* DONE page:", url)
outputFile.close()
