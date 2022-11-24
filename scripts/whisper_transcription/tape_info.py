import re

a13Tapes = {
"T920":"-035:17:25",
"T919":"-035:17:28",
"T918":"-018:45:07",
"T917":"-018:19:29",
"T916":"-002:04:40",
"T915":"-001:39:08",
"T914":"014:27:12",
"T913":"014:58:59",
"T912":"031:07:42",
"T911":"031:41:50",
"T708":"047:44:12",
"T709":"048:17:57",
"T926":"064:23:42",
"T925":"064:23:52",
"T924":"081:01:11",
"T923":"081:03:07",
"T921":"097:40:29",
"T922":"097:47:27",
"T716":"114:13:16",
"T717":"114:24:37",
"T927":"130:53:00",
"T719":"131:05:30",
}


def getTapeStartByFilename(filename):
    tapeName = re.search(r"(T\d*)_", filename).group(1)
    return a13Tapes[tapeName]