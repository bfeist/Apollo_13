trace("INIT: Loading index.js");
var cStopCache = false;

// var cCdnRoot = 'https://media.apolloinrealtime.org/mp3';
var cCdnRoot = 'https://keycdn.apolloinrealtime.org/mp3';
// var cCdnRoot = 'https://apollomedia.sfo2.cdn.digitaloceanspaces.com/mp3';
// var cCdnRoot = 'https://apollomedia.sfo2.digitaloceanspaces.com/mp3';

var cWebCdnRoot = '';
// var cWebCdnRoot = 'https://apollort-26f5.kxcdn.com';

var cYouTubeSDorHD = 0; //0 for SD  1 for HD

//constants
var cMissionDurationSeconds = 518400;
var cCountdownSeconds = 127048;
var cDefaultStartTimeId = '-000102';
var cLaunchDate = Date.parse("1970-04-11 19:13 -000");
var cLaunchDateModern = Date.parse("2019-04-11 19:13 -000");
var cCountdownStartDate = Date.parse("1970-04-10 7:55:50 -000"); //35 hours, 17 minutes, 10 seconds before launch
var cCountdownStartDateModern = Date.parse("2019-04-10 7:55:50 -000");

var cBackground_color_active = "#1e1e1e";

var cRedactedChannelsArray = [1, 4, 10, 30, 31, 36, 37, 38, 39, 40, 41, 60];

//global control objects
var player;
var gIntervalID = null;
var gIntroInterval = null;
var gApplicationReadyIntervalID = null;
var YT = {
    loading: 0,
    loaded: 0
};

//global flags
var gApplicationReady = 0;
var gFontsLoaded = false;
var gFontLoaderDelay = 3; //seconds
var gSplashImageLoaded = false;
var gMustInitNav = true;
var gPlaybackState = "normal";
var gLastTOCElement = '';
var gLastTOCTimeId = '';
var gLastCommentaryTimeId = '';
var gLastUtteranceTimeId = '';
var gLastTimeIdChecked = '';
var gLastVideoSegmentDashboardHidden = '';
var gUtteranceDisplayStartIndex;
var gUtteranceDisplayEndIndex;
var gCurrentHighlightedUtteranceIndex;
var gCommentaryDisplayStartIndex;
var gCommentaryDisplayEndIndex;
var gCurrentHighlightedCommentaryIndex;
var gDashboardManuallyToggled = false;
var gNextVideoStartTime = -1; //used to track when one video ends to ensure next plays from 0 (needed because youtube bookmarks where you left off in videos without being asked to)
var gMissionTimeParamSent = 0;

var gActiveChannel;
var gMOCRToggled = false;

var gTapesActivityStartIndex = 0;
var gTapesActivityRangeArray = [];

//global mission state trackers
var gCurrMissionTime = '';
var gCurrVideoStartSeconds = -9442; //countdown
var gCurrVideoEndSeconds = 0;

//global data objects
var gMediaList = [];
var gTOCIndex = [];
var gTOCData = [];
var gTOCDataLookup = [];
var gUtteranceIndex = [];
var gUtteranceData = [];
var gUtteranceDataLookup = [];
var gCommentaryIndex = [];
var gCommentaryData = [];
var gCommentaryDataLookup = [];
var gSearchData = [];
var gTelemetryData = [];
var gCrewStatusData = [];
var gOrbitData = [];
var gPhotoData = [];
var gPhotoIndex = [];
var gPhotoDataLookup = [];
var gMissionStages = [];
var gVideoSegments = [];
var gGeoData = [];
var gGeoCompendiumData = [];
var gPaperData = [];


$( document ).ready(function() {
    setMissionTimeIncrement();
    setAutoScrollPoller();

});

function setMissionTimeIncrement() {
    return window.setInterval(function () {
        //trace("setIntroTimeUpdatePoller()");
        gCurrMissionTime = secondsToTimeStr(timeStrToSeconds(gCurrMissionTime) + 1);
    }, 1000);
}

function setAutoScrollPoller() {
    return window.setInterval(function () {
        if (gMustInitNav) {
            initNavigator(); //only init navigator after fonts have loaded to avoid mousex position bug
            gMustInitNav = false;
        }
        if (gCurrMissionTime !== gLastTimeIdChecked) {
            gLastTimeIdChecked = gCurrMissionTime;
            //scroll nav cursor
            if (!gMouseOnNavigator) {
                drawTier1();
                drawTier1NavBox(timeStrToSeconds(gCurrMissionTime));
                drawTier2();
                drawTier2NavBox(timeStrToSeconds(gCurrMissionTime));
                drawTier3();
            }
            drawCursor(timeStrToSeconds(gCurrMissionTime));
            paper.view.draw();
        }
    }, 500); //polling frequency in milliseconds
}

function populatePhotoGallery() {
    //trace("populatePhotoGallery()");
    redrawAll();
}

function seekToTime() {
    //trace("seekToTime()");
}

function padZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function secondsToTimeStr(totalSeconds) {
    var hours = Math.abs(parseInt(totalSeconds / 3600));
    var minutes = Math.abs(parseInt(totalSeconds / 60)) % 60 % 60;
    var seconds = Math.abs(parseInt(totalSeconds)) % 60;
    seconds = Math.floor(seconds);
    var timeStr = padZeros(hours,3) + ":" + padZeros(minutes,2) + ":" + padZeros(seconds,2);
    if (totalSeconds < 0) {
        timeStr = "-" + timeStr.substr(1); //change timeStr to negative, replacing leading zero in hours with "-"
    }
    return timeStr;
}

function secondsToTimeId(seconds) {
    var timeId = secondsToTimeStr(seconds).split(":").join("");
    return parseInt(timeId);
}

function timeIdToSeconds(timeId) {
    var sign = timeId.substr(0,1);
    var hours = parseInt(timeId.substr(0,3));
    var minutes = parseInt(timeId.substr(3,2));
    var seconds = parseInt(timeId.substr(5,2));
    var signToggle = (sign == "-") ? -1 : 1;

    return signToggle * ((Math.abs(hours) * 60 * 60) + (minutes * 60) + seconds);
}

function timeIdToTimeStr(timeId) {
    return timeId.substr(0,3) + ":" + timeId.substr(3,2) + ":" + timeId.substr(5,2);
}

function timeStrToTimeId(timeStr) {
    return timeStr.split(":").join("");
}

function timeStrToSeconds(timeStr) {
    var sign = timeStr.substr(0,1);
    var hours = parseInt(timeStr.substr(0,3));
    var minutes = parseInt(timeStr.substr(4,2));
    var seconds = parseInt(timeStr.substr(7,2));
    var signToggle = (sign == "-") ? -1 : 1;
    return Math.round(signToggle * ((Math.abs(hours) * 60 * 60) + (minutes * 60) + seconds));
}

function trace(str) {
    var debug = true;
    if (debug === true) {
        try {
            console.log(str);
        } catch (e) {
            //no console, no trace
        }
    }
}