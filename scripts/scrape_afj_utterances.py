__author__ = 'Feist'
import requests
import re


def cleanseString(str):
    result = re.sub('<a name=".*"></a>', '', str)
    result = re.sub(' +', ' ', result).strip()
    return result

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

# urlArray = ["05day2-mcc2-tv.html"]

outputFilePath = "../MISSION_DATA/scraped_data/scraped_utterances_AFJ.csv"
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
    utterance = ''
    who = ''
    utterance_type = ''
    linecounter = 0
    new_line_to_write = False

    for line in lines:
        linecounter += 1
        if linecounter == 89:
            print('test area')
        line_match = re.search(r'(\d{3}:\d{2}:\d{2})', line)
        if line_match is not None:
            timestamp = line_match.group(1)

        timestamp_match = re.search(r'<b>T-(\d{3}:\d{2}:\d{2})', line)
        if timestamp_match is not None:
            timestamp = "-" + timestamp_match.group(1)[1:]

        line_match = re.search(r'<div.*(<a.*?<\/a>)?<b>(\d{3}:\d{2}:\d{2}) (.*( \(onboard\))?):</b> (.*)<\/div>', line)
        if line_match is not None:
            who = line_match.group(3)
            if "Lovell" in who:
                who = "CDR"
            elif "Haise" in who:
                who = "LMP"
            elif "Swigert" in who:
                who = "CMP"
            utterance = line_match.group(5)
            utterance_type = "T"
            new_line_to_write = True

        pao_match = re.search(r'<div class="pao">(.*)</div>', line)
        if pao_match is not None:
            who = "PAO"
            utterance = pao_match.group(1)
            utterance_type = "P"
            new_line_to_write = True

        onboard_match = re.search(r'<div class="onboard">(.*)</div>', line)
        if onboard_match is not None:
            utterance_type = "O"
            new_line_to_write = True

        cc_match = re.search(r'<div class="cc">(.*)</div>', line)
        if cc_match is not None:
            utterance_type = "C"
            new_line_to_write = True

        if new_line_to_write:
            utterance = re.sub(r'\[((L|l)ong )?(P|p)ause.*?\]', '', utterance)
            utterance = re.sub(r'\.\.\.', ' - ', utterance)
            utterance = re.sub(r'\[(G|g)arble.?\]', '...', utterance)
            utterance = re.sub(r'\.\.\.\.', '...', utterance)
            utterance = utterance.strip()
            print(str(linecounter) + " " + timestamp + "|" + utterance_type + "|" + who.strip() + "|" + utterance)
            outputFile.write(timestamp + "|" + utterance_type + "|" + who.strip() + "|" + utterance.strip() + "\n")
            new_line_to_write = False

        # if multiline_started:
        #     closing_match = re.search(r'(.*)</div>', line)
        #     if closing_match is not None:
        #         utterance += closing_match.group(1).strip() + " "
        #         multiline_started = False
        #         utterance = cleanseString(utterance)
        #         print(str(linecounter) + " GET: " + timestamp + " Commentary: " + utterance)
        #         outputFile.write(timestamp + "|" + utterance + "\n")
        #         utterance = ''
        #     else:
        #         utterance += line.strip() + " "
        #
        # commentary_match = re.search(r'<div class="comment">(.*)', line)
        # if commentary_match is not None:
        #     commentary_single_line_match = re.search(r'<div class="comment">(.*)</div>', line)
        #     if commentary_single_line_match is not None:
        #         if 'omm break.' not in commentary_single_line_match.group(1):
        #             commentary = commentary_single_line_match.group(1).strip()
        #             commentary = cleanseString(commentary)
        #             print(str(linecounter) + " GET: " + timestamp + " Commentary: " + commentary)
        #             outputFile.write(timestamp + "|" + commentary + "\n")
        #             commentary = ''
        #     else:
        #         multiline_started = True
        #         commentary += commentary_match.group(1).strip() + " "

    print("************* DONE page:", url)
outputFile.close()
