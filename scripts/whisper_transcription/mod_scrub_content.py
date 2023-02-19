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
        {"old": " span", "new": "SPAN"},
        {"old": "diskie", "new": "DSKY"},
        {"old": "verb", "new": "VERB"},
        {"old": "noun", "new": "NOUN"},
        {"old": "s4b", "new": "S-IVB"},
        {"old": "G.E.T.", "new": "GET"},
        {"old": "Econ", "new": "EECOM"},
        {"old": " ECOM", "new": " EECOM"},
        {"old": "Honey fuck off", "new": "Honeysuckle"},
        {"old": "Honey suckle", "new": "Honeysuckle"},
        {"old": "honey circle", "new": "Honeysuckle"},
        {"old": "eggs", "new": "AAGS"},
        {"old": " pings", "new": " PGNCS"},
        {"old": "Flight, tell me", "new": " Flight, TELMU"},
        {"old": "tell me, flight", "new": " TELMU, Flight"},
        {"old": "Tell me, flight", "new": " TELMU, Flight"},
        {"old": "limb", "new": "LM"},
        {"old": "Limb", "new": "LM"},
    ]
    # replace all occurrences of old with new in content
    for replacement in replacements:
        content = content.replace(replacement["old"], replacement["new"])

    return {"content": content, "skip": False}
