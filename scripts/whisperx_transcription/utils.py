import json
import os, datetime


def secondsToHHMMSS(seconds):
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    return "%d:%02d:%02d" % (h, m, s)


def saveCoverageMetadata(items, paths):
    backupPath = f"{paths['coverageFilePath']}.bak"
    if os.path.exists(backupPath):
        os.remove(backupPath)
    if os.path.exists(paths["coverageFilePath"]):
        os.rename(paths["coverageFilePath"], backupPath)
    with open(paths["coverageFilePath"], "w") as fp:
        json.dump(items, fp, indent=2)


def get_by_nasa_id(vals, expId):
    return next(x for x in vals if x["nasa_id"] == expId)


def log(message):
    print(f"{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - {message}")
