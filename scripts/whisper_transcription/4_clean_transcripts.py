import os
from operator import itemgetter


def scrubContent(content):
    # returns a dict containing 'content' and 'skip'

    unwantedWhole = ["...", "..", "."]
    # check if whole content string matches an item in unwantedWholeContent
    if content in unwantedWhole:
        return {"content": "", "skip": True}

    unwantedStartsWith = ["CAPCOM", "CAPCOM,", "VAN"]
    # check if content starts with string in unwantedStartsWith
    for unwanted in unwantedStartsWith:
        if content.startswith(unwanted + " "):
            return {"content": "", "skip": True}

    unwantedStrings = ["¦ "]
    # remove all occurrences of unwanted strings from content
    for unwanted in unwantedStrings:
        content = content.replace(unwanted, "")

    replacements = [
        {"old": "pretty large bank", "new": "pretty large bang"},
        {"old": "calm", "new": "comm"},
        {"old": "a firm", "new": "affirm"},
        {"old": "span", "new": "SPAN"},
        {"old": "diskie", "new": "DSKY"},
        {"old": "verb", "new": "VERB"},
        {"old": "noun", "new": "NOUN"},
        {"old": "s4b", "new": "S-IVB"},
        {"old": "G.E.T.", "new": "GET"},
        {"old": "Econ", "new": "EECOM"},
        {"old": " ECOM", "new": " EECOM"},
    ]
    # replace all occurrences of old with new in content
    for replacement in replacements:
        content = content.replace(replacement["old"], replacement["new"])

    return {"content": content, "skip": False}


inputPath = "E:/A13_MOCR_transcription/_raw_transcripts/"
outputPath = "E:/A13_MOCR_transcription/_transcripts/"

for file in os.listdir(inputPath):
    if not file.endswith(".txt"):
        continue

    print("Processing " + file)

    # read the file
    transcript = []
    with open(f"{inputPath}{file}", "r", encoding="utf-8") as f:
        lines = f.readlines()

        prevcontent = ""
        for line in lines:
            [timestamp, content] = line.split("||")

            # remove duplicate lines
            if content == prevcontent:
                continue
            prevcontent = content
            scrubbedContent, skip = itemgetter("content", "skip")(scrubContent(content.strip()))
            if not skip:
                transcript.append(f"{timestamp}||{scrubbedContent}")

    # create the output file
    with open(f"{outputPath}{file}", "w", encoding="utf-8") as f:
        for line in transcript:
            f.write("\n" + line)
