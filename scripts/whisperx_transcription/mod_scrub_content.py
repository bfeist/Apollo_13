def scrub_content(content):
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
        {"old": "cdr", "new": "CDR"},
        {"old": "lmp", "new": "LMP"},
        {"old": "cmp", "new": "CMP"},
        {"old": "ken ", "new": "Ken "},
        {"old": "calm", "new": "comm"},
        {"old": "a firm", "new": "affirm"},
        {"old": " span", "new": " SPAN"},
        {"old": "Spann", "new": "SPAN"},
        {"old": "diskie", "new": "DSKY"},
        {"old": " verb", "new": " VERB"},
        {"old": "verb ", "new": "VERB "},
        {"old": "noun", "new": "NOUN"},
        {"old": "s4b", "new": "S-IVB"},
        {"old": "S-4B", "new": "S-IVB"},
        {"old": "G.E.T.", "new": "GET"},
        {"old": "Econ", "new": "EECOM"},
        {"old": " ECOM", "new": " EECOM"},
        {"old": "ENCO", "new": "INCO"},
        {"old": "Enco", "new": "INCO"},
        {"old": "inco", "new": "INCO"},
        {"old": "inco", "new": "INCO"},
        {"old": "Flight fighter", "new": "Flight, FIDO"},
        {"old": "Flight booster", "new": "Flight, Booster"},
        {"old": "JNC", "new": "GNC"},
        {"old": "Honey fuck off", "new": "Honeysuckle"},
        {"old": "Honey suckle", "new": "Honeysuckle"},
        {"old": "honey circle", "new": "Honeysuckle"},
        {"old": "Ernie Suckle", "new": "Honeysuckle"},
        {"old": "eggs", "new": "AGS"},
        {"old": " pings", "new": " PGNCS"},
        {"old": "Flight, tell me", "new": "Flight, TELMU"},
        {"old": "tell me, flight", "new": "TELMU, Flight"},
        {"old": "limb", "new": "LM"},
        {"old": "Seacats", "new": "CCATS"},
        {"old": "Maryland", "new": "Marilyn"},
        {"old": "Soup", "new": "Sup"},
        {"old": "A-S-A-P", "new": "ASAP"},
        {"old": "Bromorrow", "new": "Fra Mauro"},
        {"old": "hat's firm", "new": "hat's affirm"},
        {"old": "moker", "new": "MOCR"},
        {"old": "mocha", "new": "MOCR"},
        {"old": "Ken Arvin", "new": "Carnarvon"},
        {"old": "Ken Irvin", "new": "Carnarvon"},
        {"old": "Ken Arbott", "new": "Carnarvon"},
        {"old": "Ken Harvin", "new": "Carnarvon"},
        {"old": "sec cats", "new": "CCATS"},
        {"old": "Gos", "new": "GOSS"},
        {"old": "PTG", "new": "PTC"},
        {"old": "Eggs", "new": "AGS"},
        {"old": "LIM", "new": "LM"},
        {"old": "Ox", "new": "O2"},
        {"old": "Commander Spen", "new": "Commander SPAN"},
        {"old": "RGC", "new": "RCS"},
        {"old": "Wasik", "new": "WASM"},
        {"old": "Cryo Fins", "new": "Cryo Fans"},
        {"old": "Command ok", "new": "Command Go"},
        {"old": "MSU", "new": "MSFN"},
        {"old": "NPOE", "new": "NPS"},
        {"old": "cautiously", "new": "CAU"},
        {"old": "Prelam", "new": "PRELM"},
        {"old": "Meeko", "new": "MECO"},
        {"old": "PPC", "new": "PTC"},
        {"old": "Jackoff", "new": "Jack, off"},
        {"old": "crack", "new": "track"},
        {"old": "RVA", "new": "RGA"},
        {"old": "Thank you for watching.", "new": ""},
        {"old": "monster alarm", "new": "master alarm"},
    ]

    # replace all occurrences of old with new in content
    for replacement in replacements:
        content = content.replace(replacement["old"], replacement["new"])

    return {"content": content, "skip": False}
