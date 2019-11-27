trace("INIT: Loading index.js");
//app control flags
var cStopCache = false;

// var cCdnRoot = 'https://media.apolloinrealtime.org/mp3';
var cCdnRoot = 'https://keycdn.apolloinrealtime.org/mp3';
// var cCdnRoot = 'https://apollomedia.sfo2.cdn.digitaloceanspaces.com/mp3';
// var cCdnRoot = 'https://apollomedia.sfo2.digitaloceanspaces.com/mp3';

var cWebCdnRoot = '';
// var cWebCdnRoot = 'https://apollort-26f5.kxcdn.com';

var cYouTubeSDorHD = 0; //0 for SD  1 for HD

//constants
var cMissionDurationSeconds = 713311;
var cCountdownSeconds = 74768;
var cDefaultStartTimeId = '-000109';
var cLaunchDate = Date.parse("1969-07-16 9:32 -400");
var cLaunchDateModern = Date.parse("2019-07-16 9:32 -400");
var cCountdownStartDate = Date.parse("1969-07-15 1:46:57 -400");
var cCountdownStartDateModern = Date.parse("2019-07-15 1:46:57 -400");

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

//mobile detect and redirect
if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    var url = "./mobile/" + document.location.search;
    $(location).attr('href',url);
}

//load the youtube API
var tag = document.createElement('script');
if (window.location.protocol === 'https:') {
    tag.src = "https://www.youtube.com/iframe_api";
} else {
    tag.src = "http://www.youtube.com/iframe_api";
}
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// <editor-fold desc="youtube things------------------------------------------------">

function onYouTubeIframeAPIReady() {
    trace("INIT: onYouTubeIframeAPIReady():creating player object");
    player = new YT.Player('player', {
        videoId: 'KfRygQcR5uk',
        width: '100%',
        height: '100%',
        playerVars: {
            frameborder: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            autohide: 1,
            rel: 0,
            'controls': 0,
            fs: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    // player.setPlaybackQuality('hd1080');
}

// The API will call this function when the video player is ready.
function onPlayerReady() {
    gApplicationReady += 1; //increment app ready indicator.
    trace("APPREADY: onPlayerReady: " + gApplicationReady);
    //if (gMissionTimeParamSent == 0) {
        //event.target.playVideo();
        //seekToTime(gDefaultStartTime); //jump to 1 minute to launch
    //}
}

// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1)
function onPlayerStateChange(event) {
    // trace("onPlayerStateChange():state: " + event.data);
    var playPauseBtn = $("#playPauseBtn");
    if (event.data === YT.PlayerState.PLAYING) {
        //trace("onPlayerStateChange():PLAYER PLAYING");
        playPauseBtn.addClass('pause');
        if (playPauseBtn.hasClass("blink_me_orange")) {
            playPauseBtn.removeClass("blink_me_orange");
        }
        player.setPlaybackQuality('hd1080');

        if (gNextVideoStartTime !== -1) {
            //trace("onPlayerStateChange():PLAYING: forcing playback from " + gNextVideoStartTime + " seconds in new video");
            player.seekTo(gNextVideoStartTime, true);
            gNextVideoStartTime = -1;
        }
        if (gPlaybackState === "unexpectedbuffering") {
            //trace("onPlayerStateChange():PLAYING: was unexpected buffering so calling findClosestUtterance");
            ga('send', 'event', 'transcript', 'click', 'youtube scrub');
            scrollTranscriptToTimeId(findClosestUtterance(event.target.getCurrentTime() + gCurrVideoStartSeconds));
            scrollCommentaryToTimeId(findClosestCommentary(event.target.getCurrentTime() + gCurrVideoStartSeconds));
            scrollToClosestTOC(event.target.getCurrentTime() + gCurrVideoStartSeconds);
        }
        if (gIntervalID == null) {
            //poll for mission time scrolling if video is playing
            gIntervalID = setAutoScrollPoller();
            //trace("onPlayerStateChange():INTERVAL: PLAYING: Interval started because was null: " + gIntervalID);
        }
        gPlaybackState = "normal";
    } else if (event.data === YT.PlayerState.PAUSED) {
        //clear polling for mission time scrolling if video is paused
        window.clearInterval(gIntervalID);
        //trace("onPlayerStateChange():PAUSED: interval stopped: " + gIntervalID);
        gIntervalID = null;
        gPlaybackState = "paused";
        playPauseBtn.removeClass('pause');
        if (!playPauseBtn.hasClass("blink_me_orange")) {
            playPauseBtn.addClass("blink_me_orange");
        }

    } else if (event.data === YT.PlayerState.BUFFERING) {
        // trace("onPlayerStateChange():BUFFERING: " + event.target.getCurrentTime() + gCurrVideoStartSeconds);
        event.target.setPlaybackQuality('hd1080');
        if (gPlaybackState === "transcriptclicked") {
            gPlaybackState = "normal";
        } else {
            //buffering for unknown reason, probably due to scrubbing video
            trace("onPlayerStateChange():unexpected buffering");
            gPlaybackState = "unexpectedbuffering";
        }
    } else if (event.data === YT.PlayerState.ENDED) { //load next video
        //trace("onPlayerStateChange():ENDED. Load next video.");
        var currVideoID = player.getVideoUrl().substr(player.getVideoUrl().indexOf("v=") + 2,11);
        for (var i = 0; i < gMediaList.length; ++i) {
            if (gMediaList[i][cYouTubeSDorHD] === currVideoID) {
                trace("onPlayerStateChange():Ended. Changing video from: " + currVideoID + " to: " + gMediaList[i + 1][cYouTubeSDorHD]);
                currVideoID = gMediaList[i + 1][cYouTubeSDorHD];
                break;
            }
        }
        gCurrVideoStartSeconds = timeStrToSeconds(gMediaList[i + 1][2]);
        gCurrVideoEndSeconds = timeStrToSeconds(gMediaList[i + 1][3]);

        player.iv_load_policy = 3;
        gNextVideoStartTime = 0; //force next video to start at 0 seconds in the play event handler
        player.loadVideoById(currVideoID, 0);
        player.setPlaybackQuality('hd1080');
    }
}
// </editor-fold>

// <editor-fold desc="pollers -------------------------------------------------">
function setAutoScrollPoller() {
    trace("autoScrollPoller()");
    return window.setInterval(function () {
        var totalSec = player.getCurrentTime() + gCurrVideoStartSeconds + 0.5;
        gCurrMissionTime = secondsToTimeStr(totalSec);

        if (gCurrMissionTime !== gLastTimeIdChecked) {
            if (parseInt(totalSec) % 10 === 0) { //every 10 seconds, fire a playing event
                // ga('send', 'event', 'playback', 'playing', gCurrMissionTime);
            }

            var timeId = timeStrToTimeId(gCurrMissionTime);
            gLastTimeIdChecked = gCurrMissionTime;

            scrollTranscriptToTimeId(timeId);
            scrollTOCToTimeId(timeId);
            scrollCommentaryToTimeId(timeId);
            showPhotoByTimeId(timeId);

            displayHistoricalTimeDifferenceByTimeId(timeId);
            updateDashboard(timeId);
            manageOverlaysAutodisplay(timeId);

            //scroll nav cursor
            if (!gMouseOnNavigator && !gMustInitNav) {
                //redrawAll();
                updateNavigator();
                paper.view.draw();
            } else {
                drawCursor(totalSec);
                paper.view.draw();
            }
        }

        var soundBtn = $('#soundBtn');
        if (player.isMuted() === true) {
            soundBtn.removeClass('mute');
        } else {
            soundBtn.addClass('mute');
        }

        refreshTapeActivityDisplay();

    }, 500); //polling frequency in milliseconds
}

function setIntroTimeUpdatePoller() {
    return window.setInterval(function () {
        //trace("setIntroTimeUpdatePoller()");
        displayHistoricalTimeDifferenceByTimeId(getNearestHistoricalMissionTimeId());
    }, 1000);
}

function setApplicationReadyPoller() {
    return window.setInterval(function () {
        trace("setApplicationReadyPoller(): Checking if App Ready");

        if (gFontLoaderDelay <= 0 && gFontsLoaded === false) {
            trace ('INIT: giving up on font loader');
            gFontsLoaded = true;
        }
        gFontLoaderDelay --;

        if (gFontsLoaded && gSplashImageLoaded && gMustInitNav) {
            $('body').addClass('splash-loaded'); //shows splash screen because now the fonts and image have been loaded
            initNavigator(); //only init navigator after fonts have loaded to avoid mousex position bug
            gMustInitNav = false;
        }

        if (gApplicationReady >= 4) {
            trace("APPREADY = 4! App Ready!");
            if (gMissionTimeParamSent !== 0) {
                fadeOutSplash();
                initializePlayback();
            }
            // $.isLoading( "hide" );
            $('body').addClass('app-ready');

            window.clearInterval(gApplicationReadyIntervalID);
        }
    }, 1000);
}

// </editor-fold>

// <editor-fold desc="find closest things------------------------------------------------">
function findClosestUtterance(secondsSearch) {
    trace("findClosestUtterance():" + secondsSearch);
    //if (gCurrVideoStartSeconds == 230400) {
    //    if (secondsSearch > 230400 + 3600) { //if at 065:00:00 or greater, add 000:02:40 to time
    //        secondsSearch = secondsSearch + 9600;
    //    }
    //}
    var timeId = secondsToTimeId(secondsSearch);
    var scrollTimeId = gUtteranceIndex[gUtteranceIndex.length - 1];
    for (var i = 0; i < gUtteranceIndex.length; ++i) {
        if (timeId < parseInt(gUtteranceIndex[i])) {
            scrollTimeId = gUtteranceIndex[i - 1];
            break;
        }
    }
    //trace("findClosestUtterance(): searched utterance array, found closest: timeid" + gUtteranceIndex[i - 1] + " after " + i + " searches");
    return scrollTimeId;
}

function scrollToClosestTOC(secondsSearch) {
    trace("findClosestTOC():" + secondsSearch);
    if (gCurrVideoStartSeconds === 230400) {
        if (secondsSearch > 230400 + 3600) { //if at 065:00:00 or greater, add 000:02:40 to time
            secondsSearch = secondsSearch + 9600;
        }
    }
    var timeId = secondsToTimeId(secondsSearch);
    var scrollTimeId = gTOCIndex[gTOCIndex.length - 1];
    for (var i = 0; i < gTOCIndex.length; ++i) {
        if (timeId < parseInt(gTOCIndex[i])) {
            scrollTimeId = gTOCIndex[i - 1];
            break;
        }
    }
    //trace("scrollToClosestTOC(): searched TOC array, found closest: timeid" + gTOCIndex[i - 1] + " after " + i + " searches");
    scrollTOCToTimeId(scrollTimeId);
}

function findClosestCommentary(secondsSearch) {
    //trace("scrollToClosestCommentary():" + secondsSearch);
    if (gCurrVideoStartSeconds === 230400) {
        if (secondsSearch > 230400 + 3600) { //if at 065:00:00 or greater, add 000:02:40 to time
            secondsSearch = secondsSearch + 9600;
        }
    }
    var timeId = secondsToTimeId(secondsSearch);
    var scrollTimeId = gCommentaryIndex[gCommentaryIndex.length - 1];
    for (var i = 0; i < gCommentaryIndex.length; ++i) {
        if (timeId < parseInt(gCommentaryIndex[i])) {
            scrollTimeId = gCommentaryIndex[i - 1];
            break;
        }
    }
    //trace("findClosestCommentary(): searched commentary array, found closest: timeid" + gCommentaryIndex[i - 1] + " after " + i + " searches");
    return scrollTimeId;
}

function findClosestPhoto(secondsSearch) {
    //console.log("scrollToClosestCommentary():" + secondsSearch);
    // if (gCurrVideoStartSeconds == 230400) {
    //     if (secondsSearch > 230400 + 3600) { //if at 065:00:00 or greater, add 000:02:40 to time
    //         secondsSearch = secondsSearch + 9600;
    //     }
    // }
    var timeId = secondsToTimeId(secondsSearch);
    var photoTimeId = gPhotoIndex[gPhotoIndex.length - 1];
    for (var i = 0; i < gPhotoIndex.length; ++i) {
        if (timeId < parseInt(gPhotoIndex[i])) {
            photoTimeId = gPhotoIndex[i - 1];
            break;
        }
    }
    //console.log("findClosestPhoto(): searched commentary array, found closest: timeid" + gCommentaryIndex[i - 1] + " after " + i + " searches");
    return photoTimeId;
}

// </editor-fold>

// <editor-fold desc="custom event (click) handlers -------------------------------------------------">

function historicalButtonClick() {
    trace('historicalButtonClick');
    ga('send', 'event', 'launch', 'click', 'realtime');
    window.clearInterval(gIntroInterval);
    gIntroInterval = null;
    var nearestHistTimeId = getNearestHistoricalMissionTimeId();
    onMouseOutHandler(); //remove any errant navigator rollovers that occurred during modal

    //scrollTranscriptToTimeId(findClosestUtterance(timeIdToSeconds(nearestHistTimeId)))
    //scrollCommentaryToTimeId(findClosestCommentary(timeIdToSeconds(nearestHistTimeId)));
    fadeOutSplash();
    seekToTime(nearestHistTimeId);
    //scrollTranscriptToTimeId(findClosestUtterance(timeStrToSeconds(gCurrMissionTime)));
    //scrollCommentaryToTimeId(findClosestCommentary(timeStrToSeconds(gCurrMissionTime)));
    //scrollToClosestTOC(timeStrToSeconds(gCurrMissionTime));
}

function oneMinuteToLaunchButtonClick() {
    trace('oneMinuteToLaunchButtonClick');
    ga('send', 'event', 'launch', 'click', 'oneminute');
    window.clearInterval(gIntroInterval);
    gIntroInterval = null;
    onMouseOutHandler(); //remove any errant navigator rollovers that occurred during modal

    fadeOutSplash();
    initializePlayback();
}

// <editor-fold desc="initializePlayback ---------------">

function initializePlayback() {
    trace("initializePlayback()");
    if (gMissionTimeParamSent === 0) {
        //repopulateUtterances(findClosestUtterance(timeIdToSeconds(cDefaultStartTimeId))); //jump to default start time (usually 1 minute to launch)
        //repopulateCommentary(findClosestCommentary(timeIdToSeconds(cDefaultStartTimeId)));
        seekToTime(cDefaultStartTimeId);
    } else {
        var paramMissionTime = $.getUrlVar('t'); //code to detect jump-to-timecode parameter
        paramMissionTime = decodeURIComponent(paramMissionTime);
        if (paramMissionTime === 'rt') {
            historicalButtonClick();
        } else {
            window.clearInterval(gIntroInterval);
            gIntroInterval = null;
            //repopulateUtterances(findClosestUtterance(timeStrToSeconds(paramMissionTime)));
            //repopulateCommentary(findClosestCommentary(timeStrToSeconds(paramMissionTime)));
            seekToTime(timeStrToTimeId(paramMissionTime));
        }

        if (typeof $.getUrlVar('ch') !== "undefined") {
            //open mocr channel
            var paramMOCRchannel = $.getUrlVar('ch');
            gActiveChannel = decodeURIComponent(paramMOCRchannel);
            openMOCRviz();

            setTimeout(
               function () {
                   player.pauseVideo();
               }, 3000);
        }
    }
    clearInterval(gApplicationReadyIntervalID);
    gApplicationReadyIntervalID = null;
    gIntervalID = setAutoScrollPoller();
}

// </editor-fold>

function fadeOutSplash() {
    trace('fadeOutSplash');
    //toggleFullscreen();
    $('body').removeClass('splash-loaded');
    $('.splash-content').hide();
    //setTimeout(
    //    function () {
    //        $('body').removeClass('splash-loaded');
    //        $('.splash-content').hide();
    //    }, 1600);
}

function fadeInSplash() {
    player.pauseVideo();
    $('body').addClass('splash-loaded');
    $('.splash-content').show();
}

function galleryClick(timeId) {
    ga('send', 'event', 'galleryClick', 'img', gPhotoData[gPhotoDataLookup[timeId]][1] + ".jpg");
    seekToTime(timeId);
}

function seekToTime(timeId) { // transcript click handling --------------------
    trace("seekToTime(): " + timeId);

    ga('send', 'event', 'seekToTime', 'seek', timeId);

    gDashboardManuallyToggled = false; //reset manual dashboard toggle to reenable auto show/hide
    var totalSeconds = timeIdToSeconds(timeId);
    gCurrMissionTime = secondsToTimeStr(totalSeconds); //set mission time right away to speed up screen refresh

    //if MOCRviz loaded, seek that as well
    if (gMOCRToggled) {
        var MOCRvizIframeSelector = $('#MOCRvizIframe')[0];
        MOCRvizIframeSelector.contentWindow.gCurrGETSeconds = totalSeconds;
        MOCRvizIframeSelector.contentWindow.playFromCurrGET();
        MOCRvizIframeSelector.contentWindow.refreshTapeActivityDisplay(true);
        MOCRvizIframeSelector.contentWindow.gWaveformRefresh = true;
    }

    var currVideoID = player.getVideoUrl().substr(player.getVideoUrl().indexOf("v=") + 2, 11);
    for (var i = 0; i < gMediaList.length; ++i) {
        var itemStartTimeSeconds = timeStrToSeconds(gMediaList[i][2]);
        var itemEndTimeSeconds = timeStrToSeconds(gMediaList[i][3]);

        if (totalSeconds >= itemStartTimeSeconds && totalSeconds < itemEndTimeSeconds) { //if this video in loop contains the time we want to seek to
            var seekToSecondsWithOffset = totalSeconds - itemStartTimeSeconds;
            gCurrVideoStartSeconds = itemStartTimeSeconds;
            gCurrVideoEndSeconds = itemEndTimeSeconds;
            gPlaybackState = "transcriptclicked"; //used in the youtube playback code to determine whether vid has been scrubbed
            //change youtube video if the correct video isn't already playing
            if (currVideoID !== gMediaList[i][cYouTubeSDorHD]) {
                trace("seekToTime(): changing video from: " + currVideoID + " to: " + gMediaList[i][cYouTubeSDorHD]);
                gNextVideoStartTime = seekToSecondsWithOffset;
                player.loadVideoById(gMediaList[i][cYouTubeSDorHD], seekToSecondsWithOffset, 'hd1080');
                player.setPlaybackQuality('hd1080');
            } else {
                trace("seekToTime(): no need to change video. Seeking to " + timeId);
                player.seekTo(seekToSecondsWithOffset, true);
            }
            showPhotoByTimeId(findClosestPhoto(totalSeconds));
            setTimeout(function() {
                scrollTranscriptToTimeId(findClosestUtterance(totalSeconds));
                scrollCommentaryToTimeId(findClosestCommentary(totalSeconds));
                scrollToClosestTOC(totalSeconds);
                redrawAll();
            },100);

            break;
        }
    }
}

// </editor-fold>

// <editor-fold desc="historical time handling ------------------------------------------------">

function displayHistoricalTimeDifferenceByTimeId(timeId) {
    //trace("displayHistoricalTimeDifferenceByTimeId():" + timeid);

    var sign = timeId.substr(0,1);
    var hours = Math.abs(parseInt(timeId.substr(0,3)));
    var minutes = parseInt(timeId.substr(3,2));
    var seconds = parseInt(timeId.substr(5,2));

    var conversionMultiplier = 1;
    if (sign === "-") { //if on countdown, subtract the mission time from the launch moment
        conversionMultiplier = -1;
    }

    var timeidDate = new Date(cLaunchDate.getTime());

    timeidDate.add({
        hours: hours * conversionMultiplier,
        minutes: minutes * conversionMultiplier,
        seconds: seconds * conversionMultiplier
    });

    var historicalDate = new Date(timeidDate.getTime()); //for display only
    $(".historicalDate").text(historicalDate.toDateString());

    var options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    $(".historicalTime").text(historicalDate.toLocaleTimeString('en-US', options));
    //$(".historicalTime").text(historicalDate.toLocaleTimeString().match(/^[^:]+(:\d\d){2} *(am|pm)\b/i)[0]);  //.replace(/([AP]M)$/, ""));
    //$(".historicalTimeAMPM").text(historicalDate.toLocaleTimeString().match(/([AP]M)/)[0])

    $(".missionElapsedTime").text(gCurrMissionTime);
}

function getNearestHistoricalMissionTimeId() { //proc for "snap to real-time" button

    //var nowDate = Date.parse("2015-12-06 10:00pm -500");

    var nowDate = Date.now();
    var histDate = new Date(nowDate.getTime());

    // var nowDate = Date.now();
    // //var histDate=new Date(nowDate.getTime());
    // var dateAsString = nowDate.toUTCString();
    // var histDateAsUTCString = dateAsString.substr(5,7) + cCountdownStartDate.getYear().toString() + " " + dateAsString.substr(16);
    // //var histDate=nowDate.toUTCString
    // var histDate=Date.parse(histDateAsUTCString);

    histDate.setMonth(cCountdownStartDateModern.getMonth());
    // histDate.setYear(cCountdownStartDateModern.getYear());

    var dayOfMonth = 0;
    if (nowDate.getDate() < 9) {
        dayOfMonth = nowDate.getDate() + 15;
    } else if (nowDate.getDate() >= 9 && nowDate.getDate() < 15) {
        dayOfMonth = nowDate.getDate() + 9;
    } else if (nowDate.getDate() > 24) {
        dayOfMonth = nowDate.getDate() - 9;
    } else {
        dayOfMonth = nowDate.getDate()
    }
    histDate.setDate(dayOfMonth);

    if (histDate < cCountdownStartDate) { //bump to same time next day if in the few hours on the 15th before recording starts
        histDate.setDate(16);
    }

    // Convert dates to milliseconds
    var histDate_ms = histDate.getTime();
    var countdownStartDate_ms = cCountdownStartDateModern.getTime();
    var launchDate_ms = cLaunchDateModern.getTime();

    if (histDate_ms < countdownStartDate_ms) { //if now is before the countdownStartDate, shift forward days to start on first day of the mission
        //var daysToMoveForward = Math.ceil((countdownStartDate_ms - histDate_ms) / (1000 * 60 * 60 * 24));
        var daysToMoveForward = 1;
        histDate_ms += (1000 * 60 * 60 * 24) * daysToMoveForward;
    } else if (histDate_ms > launchDate_ms + (cMissionDurationSeconds * 1000)) { //hist date occurs after mission ended, shift backward days to start on first day of the mission
        //var daysToMoveBackward = Math.floor((histDate_ms - countdownStartDate_ms) / (1000 * 60 * 60 * 24));
        var daysToMoveBackward = 1;
        histDate_ms -= (1000 * 60 * 60 * 24) * daysToMoveBackward;
    }

    var timeSinceLaunch_ms = histDate_ms - launchDate_ms;

    return secondsToTimeId(timeSinceLaunch_ms / 1000);
}

function getHistoricalDateTimeByTimeId(timeId) {
    //trace("getHistoricalDateTimeByTimeId():" + timeid);

    var sign = timeId.substr(0, 1);
    var hours = Math.abs(parseInt(timeId.substr(0, 3)));
    var minutes = parseInt(timeId.substr(3, 2));
    var seconds = parseInt(timeId.substr(5, 2));

    var conversionMultiplier = 1;
    if (sign === "-") { //if on countdown, subtract the mission time from the launch moment
        conversionMultiplier = -1;
    }

    var timeidDate = new Date(cLaunchDate.getTime());

    timeidDate.add({
        hours: hours * conversionMultiplier,
        minutes: minutes * conversionMultiplier,
        seconds: seconds * conversionMultiplier
    });

    return timeidDate;
}

// </editor-fold>

// <editor-fold desc="scrolling things------------------------------------------------">

function scrollTOCToTimeId(timeId) {
    //if (gTOCDataLookup[timeId] !== undefined) {
    if (gTOCDataLookup.hasOwnProperty(timeId)) {
    //if ($.inArray(timeId, gTOCIndex) != -1) {
        //console.log("scrollTOCToTimeID(): scrolling to " + timeId);
        var TOCFrame = $('#iFrameTOC');
        var TOCFrameContents = TOCFrame.contents();
        var TOCContainer = TOCFrameContents.find('.TOC_container');
        var TOCElement = TOCFrameContents.find('#tocid' + timeId);
        TOCFrameContents.find('.tocitem').css("background-color", ""); //clear all element highlights
        TOCElement.css("background-color", cBackground_color_active); //set new element highlights

        flashTab("tocTab");

        var scrollDestination = TOCContainer.scrollTop() + TOCElement.offset().top;
        TOCContainer.animate({scrollTop: scrollDestination}, 500);
        gLastTOCElement = TOCElement;
        gLastTOCTimeId = timeId;
    }
}

function scrollCommentaryToTimeId(timeId) { //timeid must exist in commentary
    //if (gCommentaryDataLookup[timeId] !== undefined) {
    if (gCommentaryDataLookup.hasOwnProperty(timeId)) {
    //if ($.inArray(timeId, gCommentaryIndex) != -1) {
        // console.log("scrollTranscriptToTimeId " + timeId);
        var commentaryDiv = $('#commentaryDiv');
        var commentaryTable = $('#commentaryTable');

        gCurrentHighlightedCommentaryIndex = gCommentaryDataLookup[timeId];

        if (typeof gCommentaryDisplayStartIndex === 'undefined') {
            repopulateCommentary(timeId);
            //check if timeId is already loaded into commentary div
        } else if (gCommentaryDataLookup[timeId] < gCommentaryDisplayStartIndex + 49) { //prepend
            var prependCount = (gCommentaryDisplayStartIndex - gCommentaryDataLookup[timeId]) + 50;
            if (prependCount > 50) {
                repopulateCommentary(timeId);
            } else {
                prependCount = 50;
                prependCommentary(prependCount);
            }
        } else if (gCommentaryDataLookup[timeId] > gCommentaryDisplayEndIndex - 49) { //append
            var appendCount = (gCommentaryDataLookup[timeId] - gCommentaryDisplayEndIndex) + 50;
            if (appendCount > 50) {
                repopulateCommentary(timeId);
            } else {
                appendCount = 50;
                appendCommentary(appendCount);
            }
        }
        commentaryTable.children("*").css("background-color", ""); //clear all element highlights
        var highlightedCommentaryElement = $(".comid" + timeId);
        highlightedCommentaryElement.css("background-color", cBackground_color_active); //set new element highlights

        var newScrollDestination = commentaryDiv.scrollTop() + highlightedCommentaryElement.offset().top - commentaryDiv.offset().top;
        commentaryDiv.animate({scrollTop: newScrollDestination}, 500, 'swing', function () {
            //console.log('Finished animating commentary: ' + newScrollDestination);
            trimCommentary();
        });

        flashTab("commentaryTab");
        gLastCommentaryTimeId = timeId;
    }
}

function scrollTranscriptToTimeId(timeId) {
    //if (gUtteranceDataLookup[timeId] !== undefined) {
    if (gUtteranceDataLookup.hasOwnProperty(timeId)) {
    //if ($.inArray(timeId, gUtteranceIndex) != -1) {
        //trace("scrollTranscriptToTimeId " + timeId);
        var utteranceDiv = $('#utteranceDiv');
        var utteranceTable = $('#utteranceTable');

        gCurrentHighlightedUtteranceIndex = gUtteranceDataLookup[timeId];

        //check if utteranceDiv is empty
        if (typeof gUtteranceDisplayStartIndex === 'undefined') {
            repopulateUtterances(timeId);
            //check if timeId is already loaded into utterance div
        } else if (gUtteranceDataLookup[timeId] < gUtteranceDisplayStartIndex + 49) { //prepend - always have 50 lines above current time
            var prependCount = (gUtteranceDisplayStartIndex - gUtteranceDataLookup[timeId]) + 50;
            if (prependCount > 50) {
                repopulateUtterances(timeId);
            } else {
                prependCount = 50;
                prependUtterances(prependCount);
            }
        } else if (gUtteranceDataLookup[timeId] > gUtteranceDisplayEndIndex - 49) { //append - always have 50 lines below current time
            var appendCount = (gUtteranceDataLookup[timeId] - gUtteranceDisplayEndIndex) + 50;
            if (appendCount > 50) {
                repopulateUtterances(timeId);
            } else {
                appendCount = 50;
                appendUtterances(appendCount);
            }
        }
        utteranceTable.children("*").css("background-color", ""); //clear all element highlights
        var highlightedTranscriptElement = $(".uttid" + timeId);
        highlightedTranscriptElement.css("background-color", cBackground_color_active); //set new element highlights

        var newScrollDestination = utteranceDiv.scrollTop() + highlightedTranscriptElement.offset().top - utteranceDiv.offset().top;
        utteranceDiv.animate({scrollTop: newScrollDestination}, 500, 'swing', function () {
            //trace('Finished animating: ' + scrollDestination);
            trimUtterances();
        });
        flashTab("transcriptTab");
        gLastUtteranceTimeId = timeId;
    }
}

function flashTab(tabName) {
    var flashDuration = 1000; //in ms
    var $tab = $('#' + tabName);
    if (!$tab.hasClass('selected')) {
        //trace("flash tab");
        $tab.addClass("blink_me");
        setTimeout(function(){$tab.removeClass("blink_me")}, flashDuration);
    }
}

// </editor-fold> //scrolling things

// <editor-fold desc="utterance and commentary chunking code------------------------------------------------">

function repopulateUtterances(timeId) {
    var utteranceIndex = gUtteranceDataLookup[timeId]; //must be a timeId that exists in the transcripts
    var utteranceTable = $('#utteranceTable');
    utteranceTable.html('');
    var startIndex = utteranceIndex - 50;
    var endIndex = startIndex + 100;
    startIndex = startIndex < 0 ? 0 : startIndex;
    endIndex = endIndex >= gUtteranceIndex.length ? gUtteranceIndex.length - 1 : endIndex;
    for (var i = startIndex; i <= endIndex; i++) {
        utteranceTable.append(getUtteranceObjectHTML(i));
    }
    gUtteranceDisplayStartIndex = startIndex;
    gUtteranceDisplayEndIndex = endIndex;
    trace("repopulateUtterances(): populated utterances from: " + gUtteranceDisplayStartIndex + " to " + gUtteranceDisplayEndIndex);
    $('#utteranceDiv').scrollTop('#uttid' + timeId);
}

function prependUtterances(count, atTop) {
    atTop = atTop || false;
    var utteranceDiv = $('#utteranceDiv');
    var utteranceTable = $('#utteranceTable');
    var htmlToPrepend = "";
    var prependedCount = 0;
    var startIndex = gUtteranceDisplayStartIndex - count;
    for (var i = startIndex; i < startIndex + count; i++) {
        if (i >= 0) {
            htmlToPrepend = htmlToPrepend + (getUtteranceObjectHTML(i));
            prependedCount ++;
        }
    }
    utteranceTable.prepend(htmlToPrepend);

    if (atTop) {
        var elementToScrollBackTo = $("#uttid" + timeStrToTimeId(gUtteranceData[gUtteranceDisplayStartIndex][0]));
        //trace("element to scroll back to: " + elementToScrollBackTo.attr('id'));
        var oldScrollDestination = utteranceDiv.scrollTop() + elementToScrollBackTo.offset().top - utteranceDiv.offset().top;
        utteranceDiv.scrollTop(oldScrollDestination);
    }

    trace("prependUtterances(): prepended utterances from: " + startIndex);
    gUtteranceDisplayStartIndex = gUtteranceDisplayStartIndex - prependedCount;
    trace("prependUtterances(): prepended utterances to: " + i);
    var diff = i - startIndex;
    trace("prependUtterances(): difference: " + diff);
    trace("prependUtterances(): counted prepends in if statement: " + prependedCount);
}

function appendUtterances(count, atBottom) {
    atBottom = atBottom || false;
    var utteranceDiv = $('#utteranceDiv');
    var utteranceTable = $('#utteranceTable');
    var htmlToAppend = "";
    var startIndex = gUtteranceDisplayEndIndex + 1;
    var appendedCount = 0;
    for (var i = startIndex; i < startIndex + count; i++) {
        if (i >= 0 && i < gUtteranceData.length) {
            //trace("Appended: " + gUtteranceData[i][0]);
            htmlToAppend = htmlToAppend + (getUtteranceObjectHTML(i));
            appendedCount ++;
        }
    }
    if (atBottom)
        var topToScrollBackTo = utteranceDiv.scrollTop();

    utteranceTable.append(htmlToAppend);

    if (atBottom)
        utteranceDiv.scrollTop(topToScrollBackTo);

    trace("appendUtterances(): appended utterances from: " + startIndex);
    gUtteranceDisplayEndIndex = gUtteranceDisplayEndIndex + appendedCount;
    trace("appendUtterances(): appended utterances to: " + i);
    var diff = i - startIndex;
    trace("appendUtterances(): difference: " + diff);
    trace("appendUtterances(): counted appends in if statement: " + appendedCount);
}

function trimUtterances() {
    var numberToRemove = (gUtteranceDisplayEndIndex - gUtteranceDisplayStartIndex) - 150;
    if (numberToRemove > 0) {
        trace("trimUtterances():" + numberToRemove);
        var currDistFromStart = gCurrentHighlightedUtteranceIndex - gUtteranceDisplayStartIndex;
        var currDistFromEnd = gUtteranceDisplayEndIndex - gCurrentHighlightedUtteranceIndex;
        trace("trimUtterances(): currDistFromStart: " + currDistFromStart);
        trace("trimUtterances(): currDistFromEnd: " + currDistFromEnd);
        if (currDistFromStart > currDistFromEnd) { //trim items from top of utterance div
            var counter = 0;
            for (var i = gUtteranceDisplayStartIndex; i < gUtteranceDisplayStartIndex + numberToRemove; i++) {
                $('#uttid' + gUtteranceIndex[i]).remove();
                counter++;
            }
            //trace("Trimming " + numberToRemove + " utterances from top");
            var tempEndForTrace = gUtteranceDisplayStartIndex + numberToRemove;
            trace("trimUtterances(): removed from top: " + counter + " starting at index: " + gUtteranceDisplayStartIndex + " up to index: " + tempEndForTrace);
            gUtteranceDisplayStartIndex = gUtteranceDisplayStartIndex + numberToRemove;

        } else { //trim items from bottom of utterance div
            counter = 0;
            for (i = gUtteranceDisplayEndIndex - numberToRemove; i <= gUtteranceDisplayEndIndex; i++) {
                $('#uttid' + gUtteranceIndex[i]).remove();
                counter++;
            }
            //trace("Trimming " + numberToRemove + " utterances from bottom");
            gUtteranceDisplayEndIndex = gUtteranceDisplayEndIndex - numberToRemove;
            trace("trimUtterances(): removed from bottom: " + counter + " starting at index: " + gUtteranceDisplayEndIndex - numberToRemove);
        }
        var utteranceDiv = $('#utteranceDiv');
        var currElement = $('#uttid' + timeStrToTimeId(gUtteranceData[gCurrentHighlightedUtteranceIndex][0]));
        var newScrollDestination = utteranceDiv.scrollTop() + currElement.offset().top - utteranceDiv.offset().top;
        utteranceDiv.scrollTop(newScrollDestination);
    }
}

function getUtteranceObjectHTML(utteranceIndex, style) {
    style = style || '';
    //trace("getUtteranceObjectHTML():" + utteranceIndex);
    var utteranceObject = gUtteranceData[utteranceIndex];

    var who_modified = utteranceObject[1];
    var words_modified = utteranceObject[2];

    for (var i = 0; i < gGeoData.length; i++) {
        if (gGeoData[i][0] === utteranceObject[0]) {
            var re = new RegExp(gGeoData[i][3], "g");
            words_modified = words_modified.replace(re, "<a href='javascript:;' onclick='loadGeosampleIntoOverlay(" + i + ");'>" + gGeoData[i][3] + "</a>");
        }
    }

    var html = $('#utteranceTemplate').html();
    html = html.replace("@style", style);
    var timeId = utteranceObject[0];
    html = html.replace(/@uttid/g, timeId);
    html = html.replace("@timestamp", timeIdToTimeStr(utteranceObject[0]));
    html = html.replace("@who", who_modified);
    //html = html.replace("@words", "[" + utteranceIndex + "]" + words_modified);
    html = html.replace("@words", words_modified);
    if (who_modified === "Public Affairs" || who_modified === "") {
        var uttTypeStr = "utt_pao";
    } else if (who_modified === "Mission Control") {
        uttTypeStr = "utt_capcom";
    } else {
        uttTypeStr = "utt_crew";
    }
    html = html.replace(/@uttType/g, uttTypeStr);

    //trace(utteranceObject[0] + " - " + utteranceObject[1] + " - " + utteranceObject[2]);
    return html;
}

function repopulateCommentary(timeId) {
    //console.log("repopulateCommentary:" + timeId);
    var commentaryIndex = gCommentaryDataLookup[timeId]; //must be a timeId that exists in the commentary transcripts
    var commentaryTable = $('#commentaryTable');
    commentaryTable.html('');
    var startIndex = commentaryIndex - 50;
    var endIndex = startIndex + 100;
    startIndex = startIndex < 0 ? 0 : startIndex;
    endIndex = endIndex >= gCommentaryIndex.length ? gCommentaryIndex.length - 1 : endIndex;
    for (var i = startIndex; i <= endIndex; i++) {
        commentaryTable.append(getCommentaryObjectHTML(i));
    }
    gCommentaryDisplayStartIndex = startIndex;
    gCommentaryDisplayEndIndex = endIndex;
    //$('#commentaryDiv').scrollTop('#comid' + timeId);
    var commentaryDiv = $('#commentaryDiv');
    var highlightedCommentaryElement = $(".comid" + timeId);
    var newScrollDestination = commentaryDiv.scrollTop() + highlightedCommentaryElement.offset().top - commentaryDiv.offset().top;
    commentaryDiv.animate({scrollTop: newScrollDestination}, 500, 'swing', function () {
        //trace('Finished animating: ' + scrollDestination);
        //trimUtterances();
    });
}

function prependCommentary(count, atTop) {
    atTop = atTop || false;
    if (gCommentaryDisplayStartIndex > 0) {
        var commentaryDiv = $('#commentaryDiv');
        var commentaryTable = $('#commentaryTable');
        var htmlToPrepend = "";
        var prependedCount = 0;
        var startIndex = gCommentaryDisplayStartIndex - count;
        for (var i = startIndex; i < startIndex + count; i++) {
            if (i >= 0) {
                htmlToPrepend = htmlToPrepend + (getCommentaryObjectHTML(i));
                prependedCount++;
            }
        }
        commentaryTable.prepend(htmlToPrepend);

        if (atTop) {
            var elementToScrollBackTo = $("#comid" + timeStrToTimeId(gCommentaryData[gCommentaryDisplayStartIndex][0]));
            //console.log("element to scroll back to: " + elementToScrollBackTo.attr('id'));
            var oldScrollDestination = commentaryDiv.scrollTop() + elementToScrollBackTo.offset().top - commentaryDiv.offset().top;
            commentaryDiv.scrollTop(oldScrollDestination);
        }

        //console.log("prepended commentary from:" + gCommentaryData[gCommentaryDisplayStartIndex][0]);
        gCommentaryDisplayStartIndex = gCommentaryDisplayStartIndex - prependedCount;
        //console.log("prepended commentary to:" + gCommentaryData[gCommentaryDisplayStartIndex][0]);
        trace("prependCommentary:" + prependedCount);
    } else {
        //trace("at first commentary item");
    }
}

function appendCommentary(count, atBottom) {
    atBottom = atBottom || false;
    var startIndex = gCommentaryDisplayEndIndex + 1;
    if (gCommentaryDisplayEndIndex < gCommentaryData.length - 1) {
        var commentaryDiv = $('#commentaryDiv');
        var commentaryTable = $('#commentaryTable');
        var htmlToAppend = "";
        var appendedCount = 0;
        for (var i = startIndex; i < startIndex + count; i++) {
            if (i >= 0 && i < gCommentaryData.length) {
                //trace("Appended: " + gCommentaryData[i][0]);
                htmlToAppend = htmlToAppend + (getCommentaryObjectHTML(i));
                appendedCount++;
            }
        }
        if (atBottom)
            var topToScrollBackTo = commentaryDiv.scrollTop();

        commentaryTable.append(htmlToAppend);

        if (atBottom)
            commentaryDiv.scrollTop(topToScrollBackTo);

        //console.log("appended commentary from:" + gCommentaryData[gCommentaryDisplayEndIndex][0]);
        gCommentaryDisplayEndIndex = gCommentaryDisplayEndIndex + appendedCount;
        //console.log("appended commentary to:" + gCommentaryData[gCommentaryDisplayEndIndex][0]);
        trace("appendCommentary:" + count);
    } else {
        //trace("at last commentary item");
    }
}

function trimCommentary() {
    var numberToRemove = (gCommentaryDisplayEndIndex - gCommentaryDisplayStartIndex) - 150;
    if (numberToRemove > 0) {
        trace("trimCommentary():" + numberToRemove);
        var currDistFromStart = gCurrentHighlightedCommentaryIndex - gCommentaryDisplayStartIndex;
        var currDistFromEnd = gCommentaryDisplayEndIndex - gCurrentHighlightedCommentaryIndex;
        if (currDistFromStart > currDistFromEnd) { //trim items from top of commentary div
            for (var i = gCommentaryDisplayStartIndex; i < gCommentaryDisplayStartIndex + numberToRemove; i++) {
                $('#uttid' + gCommentaryIndex[i]).remove();
            }
            //console.log("Trimming " + numberToRemove + " commentary from top");
            gCommentaryDisplayStartIndex = gCommentaryDisplayStartIndex + numberToRemove
        } else { //trim items from bottom of commentary div
            for (i = gCommentaryDisplayEndIndex - numberToRemove; i <= gCommentaryDisplayEndIndex; i++) {
                $('#uttid' + gCommentaryIndex[i]).remove();
            }
            //console.log("Trimming " + numberToRemove + " commentary from bottom");
            gCommentaryDisplayEndIndex = gCommentaryDisplayEndIndex - numberToRemove;
        }
        var commentaryDiv = $('#commentaryDiv');
        var currElement = $('#comid' + timeStrToTimeId(gCommentaryData[gCurrentHighlightedCommentaryIndex][0]));
        var newScrollDestination = commentaryDiv.scrollTop() + currElement.offset().top - commentaryDiv.offset().top;
        commentaryDiv.scrollTop(newScrollDestination);
    }
}

function getCommentaryObjectHTML(commentaryIndex) {
    //console.log("getCommentaryObjectHTML():" + commentaryIndex);
    var commentaryObject = gCommentaryData[commentaryIndex];

    var comId = commentaryObject[0];

    var attribution = commentaryObject[1];
    var who_modified = commentaryObject[2];
    var words_modified = commentaryObject[3];

    var html = $('#commentaryTemplate').html();

    if (typeof commentaryObject !== 'object') {
        trace("something very wrong");
    }

    if (who_modified !== '') {
        html = html.replace('@whocell', '<td class="who @comType">@who</td>');
        html = html.replace('@wordscell', '<td class="spokenwords @comType">@words <span class="attribution">@attribution</span></td>');
    } else {
        html = html.replace('@whocell', '');
        html = html.replace('@wordscell', '<td class="spokenwords @comType" colspan="2">@words <span class="attribution">@attribution</span></td>');
    }

    html = html.replace(/@comid/g, comId);
    html = html.replace("@timestamp", timeIdToTimeStr(comId));
    if (attribution !== '') {
        html = html.replace("@attribution", "(" + attribution + ")");
    } else {
        html = html.replace("@attribution", "");
    }
    html = html.replace("@who", who_modified);
    html = html.replace("@words", words_modified);

    if (who_modified === '') {
        var comTypeStr = "com_support";
    } else {
        comTypeStr = "com_crew";
    }
    html = html.replace(/@comType/g, comTypeStr);

    //console.log(commentaryObject[0] + " - " + commentaryObject[1] + " - " + commentaryObject[2]);
    return html;
}

// </editor-fold> //utterances and commentary

// <editor-fold desc="photo display and gallery -------------------------------------------------">

function populatePhotoGallery() {
    var photoGalleryDiv = $('#photoGallery');
    photoGalleryDiv.html('');

    for (var i = 0; i < gPhotoIndex.length; i++) {
        var photoObject = gPhotoData[i];
        var html = $('#photoGalleryTemplate').html();

        var photoName = photoObject[1];
        var filetypematch = photoName.match(/AS11-(\d\d)-(\d\d\d\d)/g);
        if (filetypematch !== null) {
            var rollNum = RegExp.$1;
            var imgNum = RegExp.$2;
            // var imageURL = 'http://tothemoon.ser.asu.edu/data_a70/AS11/extra/'  + photoObject[1] + '.thumb.png';
            var imageURL = 'https://www.lpi.usra.edu/resources/apollo/images/thumb/AS11/' + rollNum + '/' + imgNum + '.jpg';
        } else if (photoObject[3] !== '') { //if custom image URL in datafile
            imageURL = photoObject[3];
        } else {
            imageURL = 'https://www.hq.nasa.gov/alsj/a11/' + photoObject[2];
        }

        html = html.replace(/@imageURL/g , imageURL);
        html = html.replace(/@timestamp/g , timeIdToTimeStr(photoObject[0]));
        var timeid = photoObject[0];
        html = html.replace(/@timeid/g , timeid);

        //listView.append(html);
        photoGalleryDiv.append(html);
    }

    $("img.galleryImage").lazyload({
        container: photoGalleryDiv,
        threshold : 50
    });

    gApplicationReady += 1;
    trace("APPREADY: populatePhotoGallery(): " + gApplicationReady);
}

function showPhotoByTimeId(timeId) {
    //if (gTOCDataLookup[timeId] !== undefined) {
    if (gPhotoDataLookup.hasOwnProperty(timeId)) {
        loadPhotoHtml(gPhotoDataLookup[timeId]);

        //scroll photo gallery to current photo
        var photoGalleryDiv = $('#photoGallery');
        photoGalleryDiv.find('.selected').removeClass('selected');
        var photoGalleryImageTimeId = "#gallerytimeid" + gPhotoData[gPhotoDataLookup[timeId]][0];
        $(photoGalleryImageTimeId).addClass('selected');

        var scrollDest = photoGalleryDiv.scrollTop() + $(photoGalleryImageTimeId).offset().top - gNavigatorHeight - 70; //added offset for ted design
        photoGalleryDiv.animate({scrollTop: scrollDest}, 500, 'swing', function() {
            //trace('Finished animating gallery: ' + scrollDest);
        });

        flashTab("photoTab");
    }
}

function loadPhotoHtml(photoIndex) {
    //trace('loadPhotoHtml():' + photoIndex);
    if (typeof photoIndex === "undefined") {
        trace('**invalid photo call');
    }
    var photoDiv = $("#photodiv");
    var photoObject = gPhotoData[photoIndex];
    var html = $('#photoTemplate').html();

    var photoTimeId = photoObject[0];
    var photoName = photoObject[1];
    var filetypematch = photoName.match(/AS11-(\d\d)-(\d\d\d\d)/g);
    if (filetypematch !== null) {
        var rollNum = RegExp.$1;
        var imgNum = RegExp.$2;
        if (photoObject[2] !== '') {
            // var imageURL = 'https://www.hq.nasa.gov/alsj/a11/' + photoObject[2];
            var imageURL = 'https://keycdn.apolloinrealtime.org/NASA_photos/' + photoObject[2];
        } else if (photoObject[3] !== '') { //if custom image URL in datafile
            imageURL = photoObject[3];
        } else {
            imageURL = 'https://www.lpi.usra.edu/resources/apollo/images/print/AS11/' + rollNum + '/' + imgNum + '.jpg';
        }
    } else if (photoObject[3] !== '') { //if custom image URL in datafile
        imageURL = photoObject[3];
    } else {
        // imageURL = 'https://www.hq.nasa.gov/alsj/a11/' + photoObject[2];
        var imageURL = 'https://keycdn.apolloinrealtime.org/NASA_photos/' + photoObject[2];
    }
    var source = "LPI";
    var caption = photoObject[4];

    html = html.replace(/@imageURL/g , imageURL);
    html = html.replace(/@photo_name/g , photoName);
    html = html.replace(/@timeStr/g,  timeIdToTimeStr(photoTimeId));
    html = (source !== "") ? html.replace("@source", source) : html.replace("@source", "");
    html = html.replace("@caption", caption);

    photoDiv.html('');
    photoDiv.append(html);
}
// </editor-fold>

// <editor-fold desc="search and dashboard functions ---------------">

function performSearch() {
    //trace("performSearch(): start");
    var searchResultsTable = $('#searchResultsTable');
    var searchResultCount = 0;
    var searchText = $('#searchInputField').val().toLowerCase();
    searchResultsTable.html('');
    if (searchText.length > 1) {
        for (var counter = 0; counter < gSearchData.length; counter++) {
            if ( gSearchData[counter][3].toLowerCase().indexOf(searchText) !== -1) {
                var html = getSearchResultHTML(counter);
                var searchResultTextIndex = html.toLowerCase().indexOf(searchText);
                // var foundWord = getWordAt(html, searchResultTextIndex);
                // html = html.replace(foundWord, "<span class='searchResultHighlight'>" + foundWord + "</span>");
                html = html.slice(0, searchResultTextIndex) + "<span class='searchResultHighlight'>" + html.slice(searchResultTextIndex, searchResultTextIndex + searchText.length) + "</span>" + html.slice(searchResultTextIndex + searchText.length);
                searchResultsTable.append(html);
                //trace("performSearch():found: " + counter);
                searchResultCount++;
            }
            if (searchResultCount > 500) {
                break;
            }
        }
    }
}

function getSearchResultHTML(searchArrayIndex) {
    //trace("getUtteranceObjectHTML():" + utteranceIndex);
    var searchObject = gSearchData[searchArrayIndex];

    var who_modified = searchObject[2];
    var words_modified = searchObject[3];

    var html = $('#searchResultTemplate').html();
    var timeId = searchObject[0];
    html = html.replace(/@searchResultid/g, timeId);
    html = html.replace("@timestamp", timeIdToTimeStr(searchObject[0]));
    html = html.replace("@who", who_modified);
    html = html.replace("@words", words_modified);
    if (who_modified === "Public Affairs" || who_modified === "") {
        var uttTypeStr = "utt_pao";
    } else if (who_modified === "Mission Control") {
        uttTypeStr = "utt_capcom";
    } else {
        uttTypeStr = "utt_crew";
    }
    html = html.replace(/@uttType/g, uttTypeStr);
    if (searchObject[4] === 0) { //0 for utterance
        html = html.replace(/@entrytypevar/g, "transcript");
        html = html.replace(/@entrytype/g, "");
    } else if (searchObject[4] === 1) { //1 for commentary
        html = html.replace(/@entrytypevar/g, "commentary");
        html = html.replace(/@entrytype/g, "Commentary");
    } else if (searchObject[4] === 2) { //2 for geosample
        html = html.replace(/@entrytypevar/g, "geology");
        html = html.replace(/@entrytype/g, "Geology Sample");
    } else if (searchObject[4] === 3) { //3 for photo
        html = html.replace(/@entrytypevar/g, "photo");
        html = html.replace(/@entrytype/g, "Photo");
    }
    return html;
}

function searchResultClick(searchResultId, itemType) {
    toggleSearchOverlay();
    seekToTime(searchResultId);
    if (itemType === "transcript" || itemType === "geology" || itemType === "photo") {
        activateContentTab("transcriptTab");
        scrollTranscriptToCurrMissionTime();
    } else if (itemType === "commentary") {
        activateContentTab("commentaryTab");
        scrollCommentaryToCurrMissionTime();
    } else if (itemType === "toc") {
        activateContentTab("tocTab");
        scrollTOCToCurrMissionTime();
    }

}

function updateDashboard(timeId) {
    //trace("updateDashboard()");
    var timeIdInSeconds = timeIdToSeconds(timeId);

    //Display day
    var missionCurrDate = getHistoricalDateTimeByTimeId(timeId);
    var dashMissionDay = missionCurrDate.getDate();
    dashMissionDay = (dashMissionDay - 16) + 1; //16th for launch day of month
    // var dashMissionDay = Math.ceil(timeIdInSeconds / 86400);
    // dashMissionDay = dashMissionDay === 0 ? 1 : dashMissionDay;
    $('#dashMissionDay').html(dashMissionDay);

    //Display Mission Stage
    for (var counter = 0; counter < gMissionStages.length; counter ++) {
        if (timeStrToSeconds(gMissionStages[counter][0]) <= timeIdInSeconds && timeStrToSeconds(gMissionStages[counter][3]) >= timeIdInSeconds) {
            var dashMissionStage = gMissionStages[counter][2];
            break;
        }
    }
    $('#dashMissionStage').html(dashMissionStage);

    //Display Crew Status
    for (counter = 0; counter < gCrewStatusData.length; counter ++) {
        if (timeStrToSeconds(gCrewStatusData[counter][0]) <= timeIdInSeconds && timeStrToSeconds(gCrewStatusData[counter][2]) >= timeIdInSeconds) {
            var dashCrewStatus = gCrewStatusData[counter][1];
            break;
        }
    }
    if (dashCrewStatus.substr(dashCrewStatus.length - 15, 8) === 'sleeping') {
        var wakeTimeStr = gCrewStatusData[counter + 1][0];
        var timeToWakeup = secondsToTimeStr(timeStrToSeconds(wakeTimeStr) - timeStrToSeconds(gCurrMissionTime));
        dashCrewStatus += '<BR>Wake-up in: <span class="value">' + timeToWakeup + '</span>';
    }
    $('#dashCrewStatus').html(dashCrewStatus);

    var calculateVelocity;
    var calculateDistanceFromEarth;
    if (timeIdInSeconds < timeStrToSeconds("075:49:44")) { //trans-lunar coast
        calculateVelocity = true;
        calculateDistanceFromEarth = true
    } else if (timeIdInSeconds > timeStrToSeconds("135:23:36")){ //trans-earth coast
        calculateVelocity = true;
        calculateDistanceFromEarth = true;
    } else { //lunar orbit
        calculateVelocity = false;
        calculateDistanceFromEarth = false;
    }
    //Display velocity
    if (calculateVelocity) {
        if (timeIdInSeconds < timeStrToSeconds("195:18:18")) { //splashdown time
            for (counter = 0; counter < gTelemetryData.length; counter++) {
                if (timeStrToSeconds(gTelemetryData[counter][0]) < timeIdInSeconds) {
                    if (gTelemetryData[counter][1] !== "") {
                        var prevVelocityTimestampObject = gTelemetryData[counter];
                    }
                } else {
                    if (gTelemetryData[counter][1] !== "") {
                        var nextVelocityTimestampObject = gTelemetryData[counter];
                        break;
                    }
                }
            }
            var startSeconds = timeStrToSeconds(prevVelocityTimestampObject[0]);
            var startVelocity = parseInt(prevVelocityTimestampObject[1]);

            var endSeconds = timeStrToSeconds(nextVelocityTimestampObject[0]);
            var endVelocity = parseInt(nextVelocityTimestampObject[1]);
            var secondsRange = endSeconds - startSeconds;
            var velocityRange = endVelocity - startVelocity;
            var currentPositionInSecondsRange = timeIdInSeconds - startSeconds;
            var currentVelocityFPS = ((currentPositionInSecondsRange * velocityRange) / secondsRange) + startVelocity;

        } else {
            currentVelocityFPS = 0;
        }
        var numDecimals = 1;
        if (currentVelocityFPS < 100) numDecimals = 2;
        currentVelocityFPS = parseFloat(Math.round(currentVelocityFPS * 100) / 100).toFixed(numDecimals);
        var currentVelocityKPH = parseFloat(Math.round(currentVelocityFPS * 1.09728 * 100) / 100).toFixed(numDecimals);
        var currentVelocityMPH = parseFloat(Math.round(currentVelocityFPS * 0.681818 * 100) / 100).toFixed(numDecimals);
        var currentVelocityMach = parseFloat(Math.round(currentVelocityFPS * 0.00088863 * 10) / 10).toFixed(1);

        var dashVelocity = '<span class="value">' + numberWithCommas(currentVelocityFPS) + '</span> feet per second (<span class="value">' +  numberWithCommas(currentVelocityKPH) + '</span> km/h, <span class="value">' + numberWithCommas(currentVelocityMPH) + '</span> mph, Mach <span class="value">' +  currentVelocityMach + '</span>)';
        $('#dashVelocityDiv').css('display', 'block');
    } else {
        $('#dashVelocityDiv').css("display", "none");
        dashVelocity = '<span class="value">In lunar orbit</span>';
    }
    $('#dashVelocity').html(dashVelocity);

    //Display distance from Earth
    if (calculateDistanceFromEarth) {
        if (timeIdInSeconds > 0 && timeIdInSeconds < timeStrToSeconds("195:18:18")) {
            for (counter = 0; counter < gTelemetryData.length; counter++) {
                if (timeStrToSeconds(gTelemetryData[counter][0]) < timeIdInSeconds) {
                    if (gTelemetryData[counter][2] !== "") {
                        var prevDistanceEarthTimestampObject = gTelemetryData[counter];
                    }
                } else {
                    if (gTelemetryData[counter][2] !== "") {
                        var nextDistanceEarthTimestampObject = gTelemetryData[counter];
                        break;
                    }
                }
            }
            startSeconds = timeStrToSeconds(prevDistanceEarthTimestampObject[0]);
            var startDistanceEarth = parseFloat(prevDistanceEarthTimestampObject[2]);

            endSeconds = timeStrToSeconds(nextDistanceEarthTimestampObject[0]);
            var endDistanceEarth = parseFloat(nextDistanceEarthTimestampObject[2]);
            secondsRange = endSeconds - startSeconds;
            var distanceEarthRange = endDistanceEarth - startDistanceEarth;
            currentPositionInSecondsRange = timeIdInSeconds - startSeconds;
            var currentDistanceEarthNM = ((currentPositionInSecondsRange * distanceEarthRange) / secondsRange) + startDistanceEarth;

        } else {
            currentDistanceEarthNM = 0;
        }
        numDecimals = 1;
        if (currentDistanceEarthNM < 100) numDecimals = 2;
        currentDistanceEarthNM = (Math.round(currentDistanceEarthNM * 100) / 100).toFixed(numDecimals);
        var currentDistanceEarthKM = (Math.round(currentDistanceEarthNM * 1.852 * 100) / 100).toFixed(numDecimals);
        var dashDistanceEarth = '<span class="value">' + numberWithCommas(currentDistanceEarthNM) + '</span> nautical miles (<span class="value">' + numberWithCommas(currentDistanceEarthKM) + '</span> km)';
        $('#dashLunarOrbit').css('display', 'none');

    } else { //in lunar orbit
        dashDistanceEarth = '<span class="value">207,559</span> nautical miles (<span class="value">384,399.2</span> km) average';
        //Display Mission Stage
        for (counter = 0; counter < gOrbitData.length; counter ++) {
            if (timeStrToSeconds(gOrbitData[counter][0]) <= timeIdInSeconds && timeStrToSeconds(gOrbitData[counter][2]) >= timeIdInSeconds) {
                var orbitNum = gOrbitData[counter][1];
                break;
            }
        }
        var dashLunarOrbit = '<span class="value">In lunar orbit.</span> Orbit: <span class="value">' + orbitNum + '/31</span>';
        var dashLunarOrbitSelector = $('#dashLunarOrbit');
        dashLunarOrbitSelector.css('display', 'block');
        dashLunarOrbitSelector.html(dashLunarOrbit);
    }
    $('#dashDistanceEarth').html(dashDistanceEarth);

    //attempts at formulaic velocity calculation. Doesn't work due to moon's gravitational influence on the parabola formula
    //var dashDistanceNM = -1 * (8486888657 * Math.pow(timeIdInSeconds, 2) / 8820689674156545) + ((1881583668117446 * timeIdInSeconds) / 1764137934831309) + (811004768622602161 / 2940229891385515);
    //left half
    //var dashDistanceNM = -1 * (9987355187 * Math.pow(timeIdInSeconds, 2) / 3604494879727504) + ((5611270876937931 * timeIdInSeconds) / 3604494879727504) - (35715506986568310715 / 1802247439863752);
}

function manageOverlaysAutodisplay(timeId) {
    //trace("manageOverlaysAutodisplay()");
    //look to see if the current time is within a video segment
    var inVideoSegment = false;
    var dashboardOverlay = $('.dashboard-overlay');
    for (var counter = 0; counter < gVideoSegments.length; counter ++) {
        if (timeStrToSeconds(gVideoSegments[counter][0]) <= timeIdToSeconds(timeId) && timeStrToSeconds(gVideoSegments[counter][1]) >= timeIdToSeconds(timeId)) {
            inVideoSegment = true;
            //hide dashboard overlay if it is displayed (once per video segment)
            if (dashboardOverlay.css('display').toLowerCase() !== 'none' && gLastVideoSegmentDashboardHidden !== gVideoSegments[counter][0] && !gDashboardManuallyToggled) {
                gLastVideoSegmentDashboardHidden = gVideoSegments[counter][0];
                hideDashboardOverlay();
            }
            break;
        }
    }
    if (!inVideoSegment && dashboardOverlay.css('display').toLowerCase() === 'none' && !gDashboardManuallyToggled) {
        showDashboardOverlay();
        gLastVideoSegmentDashboardHidden = '';
    }
}

// </editor-fold>

// <editor-fold desc="utility functions ---------------">

function padZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function toggleSearchOverlay() {
    var searchOverlaySelector = $('.search-overlay');
    var searchBtnSelector =  $('#searchBtn');
    if (searchOverlaySelector.css('display').toLowerCase() === 'none') {
        //searchOverlaySelector.css('display', 'block');
        searchOverlaySelector.fadeIn();
        searchBtnSelector.removeClass('subdued');
        searchBtnSelector.addClass('primary');
        $('#searchInputField').focus();
        if ($('.dashboard-overlay').css('display').toLowerCase() !== 'none') { //turn off dashboard if it's up
            toggleDashboardOverlay();
        }
    } else {
        //searchOverlaySelector.css("display", "none");
        searchOverlaySelector.fadeOut();
        searchBtnSelector.removeClass('primary');
        searchBtnSelector.addClass('subdued');
        gDashboardManuallyToggled = false; //cause dashboard to be once again auto-displayed
    }
}

function toggleDashboardOverlay() {
    gDashboardManuallyToggled = true; //because dashboard manually clicked, turn off auto dashboard toggle to disable auto show/hide. Seeking resets this.
    if ($('.dashboard-overlay').css('display').toLowerCase() === 'none') {
        showDashboardOverlay();
    } else {
        hideDashboardOverlay();
    }
}

function showDashboardOverlay() {
    var dashboardOverlaySelector = $('.dashboard-overlay');
    var dashboardBtnSelector =  $('#dashboardBtn');
    //dashboardOverlaySelector.css('display', 'block');
    dashboardOverlaySelector.fadeIn();
    $('#dashboardContent').modemizr({
       bps: 2400,
       cursor: true,
       blink: false,
       imageSpeedup: 100,
       show: false
    });
    dashboardBtnSelector.removeClass('subdued');
    dashboardBtnSelector.addClass('primary');
    if ($('.search-overlay').css('display').toLowerCase() !== 'none') { //turn off search if it's up
        toggleSearchOverlay();
    }
}

function hideDashboardOverlay() {
    var dashboardOverlaySelector = $('.dashboard-overlay');
    var dashboardBtnSelector =  $('#dashboardBtn');
    //dashboardOverlaySelector.css("display", "none");
    dashboardOverlaySelector.fadeOut();
    dashboardBtnSelector.removeClass('primary');
    dashboardBtnSelector.addClass('subdued');
}


//app tab content
function openMOCRviz() {
    closeGeosampleOverlay();

    var html = $('#MOCROverlayTemplate').html();
    html = html.replace(/@ch/g, gActiveChannel);
    $('#thirtytrackplaceholder').append(html);
    $('#soundBtn').removeClass('mute');
    player.mute();
    gMOCRToggled = true;
    $('#MOCRvizIframe').load(function () {
        console.log('MOCR iframe loaded successfully');
    });
}

function closeMOCRviz() {
    $('#thirtytrackplaceholder').empty();
    $('#soundBtn').addClass('mute');
    player.unMute();
    gMOCRToggled = false;
}

function openGeosampleOverlay() {
    closeMOCRviz();

    var geosampleTable = $('#geosampleTable');
    geosampleTable.html('');
    var html = $('#geosampleSplash').html();

    var samplerows = '';
    for (var i = 0; i < gGeoData.length; i++) {
        var sampleNums = gGeoData[i][5].split('`');
        var sampleNumsItem = '';
        for (var x = 0; x < sampleNums.length; x++) {
            if (x == sampleNums.length - 1) {
                sampleNumsItem += sampleNums[x]
            } else {
                sampleNumsItem += sampleNums[x] + ', ';
            }
        }

        samplerows += "<tr onclick='seekToGeosample(" + i + ")'>" +
            "<td>" + timeIdToTimeStr(gGeoData[i][0]) + "</td>" +
            "<td class='samplecontainerslink'>" + gGeoData[i][2] + "</td>" +
            "<td>" + sampleNumsItem + "</td>" +
            "</tr>\n";
    }
    html = html.replace(/@samplerows/g, samplerows);
    geosampleTable.html(html);

    var geosampleOverlaySelector = $('#geosample-overlay');
    geosampleOverlaySelector.fadeIn();
}

function closeGeosampleOverlay() {
    var geosampleOverlaySelector = $('#geosample-overlay');
    geosampleOverlaySelector.fadeOut();
}

function seekToGeosample(GeoDataIndex) {
    seekToTime(gGeoData[GeoDataIndex][0]);
    loadGeosampleIntoOverlay(GeoDataIndex);
}

function loadGeosampleIntoOverlay(geoDataIndex) {
    closeMOCRviz();
    activateAppTab('geosampleTab');

    ga('send', 'event', 'button', 'click', 'geosample');
    var geosampleTable = $('#geosampleTable');
    geosampleTable.html('');
    $('#bagnum').html(' - ' + gGeoData[geoDataIndex][2]);

    var sampleNumberArray = gGeoData[geoDataIndex][5].split("`");

    for (var counter = 0; counter < sampleNumberArray.length; counter++) {
        // add papers table
        var paperHtml = "";
        var firstPapersIteration = true;
        var papersFound = false;
        for (var paperCounter = 0; paperCounter < gPaperData.length - 1; paperCounter++) {
            if (gPaperData[paperCounter][10].includes(sampleNumberArray[counter])) {
                papersFound = true;
                if (firstPapersIteration) {
                    paperHtml = paperHtml + "<div class='geoPapersTitle'>Published scientific papers that reference <span class='samplenum'>Sample " + sampleNumberArray[counter] + "</span></div>\n";
                    paperHtml = paperHtml + "<table class='geoPapersTable'><thead><tr>" +
                        "<th>Year</th>" +
                        "<th>Title</th>" +
                        "<th>Authors</th>" +
                        "<th>Journal</th>" +
                        "</tr></thead><tbody>\n";
                    firstPapersIteration = false;
                }
                var journalString = gPaperData[paperCounter][4];
                if (gPaperData[paperCounter][5] !== "") journalString = journalString + ", Vol. " + gPaperData[paperCounter][5];
                if (gPaperData[paperCounter][6] !== "") journalString = journalString + ", Issue " + gPaperData[paperCounter][6];
                if (gPaperData[paperCounter][7] !== "") journalString = journalString + ", Page " + gPaperData[paperCounter][7];

                var linkURL = "";
                if (gPaperData[paperCounter][9] !== "") { //use DOI link if available
                    linkURL = gPaperData[paperCounter][9];
                } else if (gPaperData[paperCounter][0] !== "") { // if no DOI, use Bibcode link to ADS if available
                    linkURL = "https://ui.adsabs.harvard.edu/#abs/" + gPaperData[paperCounter][0] + "/abstract";
                } else { // fall back to using google scholar
                    linkURL = "https://scholar.google.ca/scholar?hl=en&as_sdt=0%2C5&q=" + gPaperData[paperCounter][1] + "+" + gPaperData[paperCounter][2];
                    linkURL = linkURL.replace(' ', '+');
                    linkURL = encodeURI(linkURL);
                }

                paperHtml = paperHtml + "<tr>" +
                    "<td><a href='" + linkURL + "' target='_blank'>" + gPaperData[paperCounter][1] + "</a></td>" +
                    "<td><a href='" + linkURL + "' target='_blank'>" + gPaperData[paperCounter][2] + "</a></td>" +
                    "<td><a href='" + linkURL + "' target='_blank'>" + gPaperData[paperCounter][3] + "</a></td>" +
                    "<td><a href='" + linkURL + "' target='_blank'>" + journalString + "</a></td>" +
                    "</tr>\n";
            }
        }
        if (!firstPapersIteration) {
            paperHtml = paperHtml + "</tbody></table>\n"
        }

        //add sample compendium link if exists
        var compendiumHtml = "";
        for (var compendiumCounter = 0; compendiumCounter < gGeoCompendiumData.length; compendiumCounter++) {
            if (gGeoCompendiumData[compendiumCounter][1].includes(sampleNumberArray[counter])) {
                var compendiumSampleNumber = gGeoCompendiumData[compendiumCounter][0];
                if (gGeoCompendiumData[compendiumCounter][2] === 'compendium') {
                    compendiumHtml = '<span> - <a href="https://curator.jsc.nasa.gov/lunar/lsc/' + compendiumSampleNumber + '.pdf" target="geoImage">Lunar Sample Compendium (PDF)</a></span>';
                } else {
                    compendiumHtml = '<span> - <a href="https://curator.jsc.nasa.gov/lunar/catalogs/apollo11/' + compendiumSampleNumber + '.pdf" target="geoImage">Lunar Sample Information Catalog (PDF)</a></span>';
                }
                break;
            }
        }

        var html = getGeosampleHTML(sampleNumberArray[counter], paperHtml, compendiumHtml);
        geosampleTable.append(html);

        // remove papers element if no papers
        if (!papersFound) {
            var element = document.getElementById("geoPapers" + sampleNumberArray[counter]);
            element.remove();
        }

        // if (compendiumHtml == "") {
        //     element = document.getElementById("geoSampleCompendium" + sampleNumberArray[counter]);
        //     element.remove();
        // }

        //get sample images
        jQuery.ajax({
            url: './indexes/geosampledetails/' + sampleNumberArray[counter] + '.csv',
            success: function (data) {
                if (data.isOk === false) {
                    alert(data.message);
                }
                var sampleID = this.url.substring(this.url.length - 9, this.url.length - 4);
                var allImages = data.split('|');
                var geoImagesDivSelector = $("#geoImages" + sampleID);
                var html = '<div class="sampleimagessubtitle">Sample Photography</div>';
                html = html + '<ul class="flex-container">';

                for (var i = 0; i < allImages.length; i++) {
                    html = html + '<li><a href="https://curator.jsc.nasa.gov/lunar/samplecatalog/photoinfo.cfm?photo=' + allImages[i] + '" target="geoImage"><img src="https://curator.jsc.nasa.gov/lunar/samplecatalog/photos/thumbs/' + allImages[i] + '.jpg"></a></li>';
                }
                html = html + "</ul>";
                geoImagesDivSelector.html(html);
            },
            error: function () {
                //remove images div if no images file containing image list is found
                var sampleID = this.url.substring(this.url.length - 9, this.url.length - 4);
                var element = document.getElementById("geoImages" + sampleID);
                element.remove();
            },
            async: true
        });

        // get moondb info into sampleinfotable
        jQuery.ajax({
            url: 'http://api.moondb.org/specimen/' + sampleNumberArray[counter],
            success: function (data) {
                if (data.isOk === false) {
                    alert(data.message);
                }
                var sampleID = this.url.substring(this.url.length - 5, this.url.length);
                var moondbDivSelector = $("#moondb" + sampleID);
                // var moondbhtml = JSON.stringify(data);
                var moondbhtml = "<table class='sampleinfotable'>" +
                    "<tr>" +
                    "<td>Specimen Name</td>" +
                    "<td>" + (data.specimenName != null ? data.specimenName : '') + "</td>" +
                    "<td>Lunar Station</td>" +
                    "<td>" + (data.lunarStation != null ? data.lunarStation : '') + "</td></tr>\n";

                moondbhtml = moondbhtml +
                    "<tr>" +
                    "<td>Specimen Type</td>" +
                    "<td>" + (data.specimenType != null ? data.specimenType : '') + "</td>" +
                    "<td>Return Container</td>" +
                    "<td>" + (data.returnContainer != null ? data.returnContainer : '') + "</td></tr>\n";

                moondbhtml = moondbhtml +
                    "<tr>" +
                    "<td>Sampling Technique</td>" +
                    "<td>" + (data.samplingTechnique != null ? data.samplingTechnique : '') + "</td>" +
                    "<td>Weight</td>" +
                    "<td>" + (data.weight != null ? data.weight : '') + "</td></tr>\n";

                moondbhtml = moondbhtml +
                    "<tr>" +
                    "<td>Landmark</td>" +
                    "<td>" + (data.landmark != null ? data.landmark : '') + "</td>" +
                    "<td>Pristinity</td>" +
                    "<td>" + (data.pristinity != null ? data.pristinity : '') + " (" + (data.pristinityDate != null ? data.pristinityDate : '') + ")</td></tr>\n";

                moondbhtml = moondbhtml +
                    "<tr>" +
                    "<td>Description</td>" +
                    "<td colspan='3'>" + (data.description != null ? data.description : '') + "</td>" +
                    "</tr>\n";

                moondbhtml = moondbhtml +
                    "<tr>" +
                    "<td>Child Specimens</td>" +
                    "<td colspan='3'>" + data.childSpecimens.join(" ") + "</td>" +
                    "</tr>\n";
                moondbDivSelector.html(moondbhtml);
            },
            async: true
        });
    }
    var geosampleOverlaySelector = $('#geosample-overlay');
    geosampleOverlaySelector.fadeIn();
}

function getGeosampleHTML(samplenumber, paperHtml, compendiumHtml) {
    //trace("getUtteranceObjectHTML():" + utteranceIndex);
    var html = $('#geosampleTemplate').html();

    html = html.replace(/@samplenumber/g, samplenumber);
    html = html.replace(/@papers/g, paperHtml);
    html = html.replace(/@geocompendium/g, compendiumHtml);
    return html;
}



function toggleFullscreen() {
    if ($(document).fullScreen() === false) {
        $(document).fullScreen(true);
    } else {
        $(document).fullScreen(false);
    }
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
    return secondsToTimeStr(seconds).split(":").join("");
}

function timeIdToSeconds(timeId) {
    var sign = timeId.substr(0,1);
    var hours = parseInt(timeId.substr(0,3));
    var minutes = parseInt(timeId.substr(3,2));
    var seconds = parseInt(timeId.substr(5,2));
    var signToggle = (sign === "-") ? -1 : 1;
    var totalSeconds = signToggle * ((Math.abs(hours) * 60 * 60) + (minutes * 60) + seconds);
    //if (totalSeconds > 230400)
    //    totalSeconds -= 9600;
    return totalSeconds;
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
    var signToggle = (sign === "-") ? -1 : 1;
    var totalSeconds = Math.round(signToggle * ((Math.abs(hours) * 60 * 60) + (minutes * 60) + seconds));
    return totalSeconds;
}

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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

function getWordAt(str, pos) {

    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(/\S+$/),
        right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
        return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// </editor-fold>

// <editor-fold desc="document event handlers -------------------------------------------------">

//on doc init
jQuery(function ($) {
    trace("INIT: jQuery(function ($)");
    if (typeof $.getUrlVar('t') !== "undefined") {
        gMissionTimeParamSent = 1;
    } else {
        gMissionTimeParamSent = 0;
    }
    activateContentTab('transcriptTab');
    //buttons

    $("#searchBtn")
        .click(function(){
            ga('send', 'event', 'button', 'click', 'search');
            toggleSearchOverlay();
        });

    $("#dashboardBtn")
        .click(function(){
            ga('send', 'event', 'button', 'click', 'dashboard');
            toggleDashboardOverlay();
        });

    $("#searchInputField")
        //.change(function(){
        .keyup($.throttle(function(){
            performSearch();
        }, 100));


    $(".fullscreenBtn")
        .click(function(){
            ga('send', 'event', 'button', 'click', 'fullscreen');
            toggleFullscreen();
        });

    $("#playPauseBtn")
        .click(function(){
            if ($("#playPauseBtn").hasClass('pause')) {
                ga('send', 'event', 'button', 'click', 'pause');
                player.pauseVideo();
                $('#playPauseBtn').addClass("blink_me_orange");

            } else {
                ga('send', 'event', 'button', 'click', 'play');
                player.playVideo();
                $('#playPauseBtn').removeClass("blink_me_orange");
            }
        });

    $("#soundBtn")
        .click(function(){
            if (player.isMuted() === true) {
                ga('send', 'event', 'button', 'click', 'unmute');
                if (gMOCRToggled) {
                    closeMOCRviz(); //includes unmuting player and adding class below
                    activateAppTab('photoTab');
                } else {
                    player.unMute();
                    $(this).addClass('mute');
                }
            } else {
                ga('send', 'event', 'button', 'click', 'mute');
                player.mute();
                // btnIcon = "ui-icon-volume-off";
                // btnText = "Un-Mute";
                $(this).removeClass('mute');
            }
        });

    $("#realtimeBtn")
        .click(function(){
            ga('send', 'event', 'button', 'click', 'realtime');
            historicalButtonClick();
        });

    $("#aboutBtn")
        .click(function(){
            ga('send', 'event', 'button', 'click', 'help');

            $('[data-js-class="HelpOverlayManager"]').each(function() {
              $(this).data('helpOverlayManager').showHelp();
            });
        });
    $("#aboutSplashBtn")
        .click(function(){
            ga('send', 'event', 'button', 'click', 'help');

            $('[data-js-class="HelpOverlayManager"]').each(function() {
                $(this).data('helpOverlayManager').showHelp();
            });
        });

    $("#shareBtn")
        .click(function(){
            ga('send', 'event', 'button', 'click', 'share');
            if (gMOCRToggled) {
                var url = "https://apolloinrealtime.org/11/?t=" + gCurrMissionTime + "%26ch=" + $('#MOCRvizIframe')[0].contentWindow.gActiveChannel;
                var text = "%23Apollo11 in Real-time. Mission control audio channel " + $('#MOCRvizIframe')[0].contentWindow.cTrackInfo['ch' + $('#MOCRvizIframe')[0].contentWindow.gActiveChannel][0] + " at " + gCurrMissionTime + " %23NASA";
            } else {
                var sharedUtteranceArray = gUtteranceData[gUtteranceDataLookup[findClosestUtterance(timeStrToSeconds(gCurrMissionTime))]];
                // url = "https://apolloinrealtime.org/11/?t=" + timeIdToTimeStr(sharedUtteranceArray[0]);
                url = "https://apolloinrealtime.org/11/?t=" + gCurrMissionTime;
                text = "%23Apollo11 in Real-time: " + timeIdToTimeStr(sharedUtteranceArray[0]) + " " + sharedUtteranceArray[1] + ": " + sharedUtteranceArray[2].substr(0, 67) + "... ";
            }
            var hashtags = 'nasa';
            var twitterWindow = window.open('https://twitter.com/share?url=' + url + '&text=' + text + '&hashtags=' + hashtags, 'twitter-popup', 'height=350,width=600');
            if(twitterWindow.focus) { twitterWindow.focus(); }
        });

    //content tab button events
    $("#transcriptTab").click(function(){
        ga('send', 'event', 'tab', 'click', 'transcript');
        activateContentTab(this.id);
        setTimeout(function(){
            scrollTranscriptToCurrMissionTime();
        },100);

    });

    $("#tocTab").click(function(){
        ga('send', 'event', 'tab', 'click', 'toc');
        activateContentTab(this.id);
        scrollTOCToCurrMissionTime();
    });

    $("#commentaryTab").click(function(){
        ga('send', 'event', 'tab', 'click', 'commentary');
        activateContentTab(this.id);
        setTimeout(function(){
            scrollCommentaryToCurrMissionTime();
        },100);
    });


    //app tab button events
    $("#photoTab").click(function(){
        ga('send', 'event', 'tab', 'click', 'photo');
        activateAppTab(this.id);
        closeGeosampleOverlay();
        closeMOCRviz();
    });

    $("#mocrTab").click(function(){
        ga('send', 'event', 'tab', 'click', 'mocr');
        activateAppTab(this.id);
        closeGeosampleOverlay();
        openMOCRviz();
    });

    $("#geosampleTab").click(function(){
        ga('send', 'event', 'tab', 'click', 'geosample');
        activateAppTab(this.id);
        closeMOCRviz();
        openGeosampleOverlay();
    });
});

function activateContentTab(tabId) {
    $('.splash-btn.content-tab').removeClass('selected');
    $('#' + tabId).addClass('selected');

    var rootName = tabId.substring(0, tabId.length - 3);
    $('.text-wrapper').css("display", "none");
    $('#' + rootName + "Wrapper").css("display", "block");
}

function activateAppTab(tabId) {
    $('.splash-btn.app-tab').removeClass('selected');
    $('#' + tabId).addClass('selected');
}

function scrollTranscriptToCurrMissionTime() {
    scrollTranscriptToTimeId(findClosestUtterance(timeStrToSeconds(gCurrMissionTime)));
}
function scrollTOCToCurrMissionTime() {
    scrollToClosestTOC(timeStrToSeconds(gCurrMissionTime));
}
function scrollCommentaryToCurrMissionTime() {
    scrollCommentaryToTimeId(findClosestCommentary(timeStrToSeconds(gCurrMissionTime)));
}

//on fullscreen toggle
$(window).bind('fullscreenchange', function() {
    // var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    redrawAll();
});

//on window resize
$(window).resize($.throttle(function(){ //scale image proportionally to image viewport on load
    console.log('***window resize');
    proportionalWidthOnPhotoBlock();
    $('#thirtytrack-container').css({ height: $(window).innerHeight() - 213 });
    redrawAll();
}, 250));

function initSplash() {
    //flags set in this function are acted upon in the applicationreadypoller
    var $splash = $('.splash-content');
    var webFontConfig = {
        google: {
            families: ['Michroma',
                'Oswald:300,400,700',
                'Roboto Mono:200,400,500,700',
                'Roboto Slab:300']
        },
        active: function() {
            trace("INIT: fonts loaded");
            gFontsLoaded = true;
        }
    };
    WebFont.load(webFontConfig);
    $.when($splash.waitForImages()).done(function(){
        trace("INIT: splash image loaded");
        gSplashImageLoaded = true;
    });
    $('#LRO-overlay').hide(); //hide LRO overlay by default
    setSplashHistoricalSubtext();
    gIntroInterval = setIntroTimeUpdatePoller();
}

function setSplashHistoricalSubtext() {
    // var currDate = Date.now();

    // var currDate_ms = currDate.getTime();
    // var countdownStartDate_ms = cCountdownStartDate.getTime();
    // var launchDate_ms = cLaunchDate.getTime();
    // var missionEndDate_ms = launchDate_ms + (cMissionDurationSeconds * 1000);

    //if (currDate_ms >= countdownStartDate_ms && currDate_ms < missionEndDate_ms) { //check if during mission anniversary
        //$('.section.now').css('display', '');
       // $('.historicalSubtext').html("<b>Mission Anniversary</b><BR>Exactly 50 years ago");
   // } else {
        $('.historicalSubtext').text("50 years ago");  //todo make this calculate how many years ago
   //      $('.historicalSubtext').text("49 years, 11 months ago");  //todo make this calculate how many years ago
   // }
}

function proportionalWidthOnPhotoBlock() {
    var appBlockWidth = $('body').width() - ($('.video-block').width() + $('.thirtytrack-block').width()) - 1;
    //trace("trying to set photo block width: " + appBlockWidth);
    $('.app-with-tabs-block').width(appBlockWidth);
}

function thirtyButtons_click() {
    // console.log("select-channel-button clicked: " + $(this).attr('id'));
    activateAppTab('mocrTab');
    ga('send', 'event', '30track', 'click', 'channelbutton');
    gActiveChannel = parseInt($(this).attr('id').substr($(this).attr('id').indexOf('ch') + 2)); //get channel number from button label

    if (gMOCRToggled === false) {
        var html = $('#MOCROverlayTemplate').html();
        html = html.replace(/@ch/g , gActiveChannel);
        $('#thirtytrackplaceholder').append(html);
        $('#soundBtn').removeClass('mute');
        player.mute();
        gMOCRToggled = true;
        $('#MOCRvizIframe').load(function(){
            console.log('iframe loaded successfully');
        });
    } else { //MOCRviz already open so just change channel
        var MOCRvizIframeSelector = $('#MOCRvizIframe')[0];
        MOCRvizIframeSelector.contentWindow.gActiveChannel = gActiveChannel;
        MOCRvizIframeSelector.contentWindow.loadChannelSoundfile();
        MOCRvizIframeSelector.contentWindow.setControllerDetails();
        MOCRvizIframeSelector.contentWindow.playFromCurrGET();
        MOCRvizIframeSelector.contentWindow.refreshTapeActivityDisplay(true);
    }
}

function thirtyButtons_hover() {
    // console.log("thirtyButtons_hover hovered: " + $(this).attr('id'));
    //show button hover
    var hoverChannelNum = parseInt($(this).attr('id').substr($(this).attr('id').indexOf('ch') + 2));
    $('.thirtybtn-channel').removeClass('thirtybtn-hover');
    $('#btn-ch' + hoverChannelNum).addClass('thirtybtn-hover');

    if (gMOCRToggled === true) {
        var MOCRvizIframeSelector = $('#MOCRvizIframe')[0];
        MOCRvizIframeSelector.contentWindow.channelButtons_hover(hoverChannelNum);
    }
}
function thirtyButtons_mouseleave() {
    $('.thirtybtn-channel').removeClass('thirtybtn-hover');
    if (gMOCRToggled === true) {
        var MOCRvizIframeSelector = $('#MOCRvizIframe')[0];
        MOCRvizIframeSelector.contentWindow.channelButtons_mouseleave();
    }
}

function thirtyButtons_hover_fromMOCRviz(hoverChannelNum) {
    // console.log("thirtyButtons_hover_fromMOCRviz hovered: " + $(this).attr('id'));
    //show button hover
    $('.thirtybtn-channel').removeClass('thirtybtn-hover');
    $('#btn-ch' + hoverChannelNum).addClass('thirtybtn-hover');
}
function thirtyButtons_mouseleave_fromMOCRviz() {
    $('.thirtybtn-channel').removeClass('thirtybtn-hover');
}

function refreshTapeActivityDisplay() {
    getTapeActivityRanges(timeStrToSeconds(gCurrMissionTime));
    setChannelButtonColors();
}
function getTapeActivityRanges(activeSec) {
    // trace("index.js getTapeActivityRanges: " + activeSec);
    activeSec = activeSec + cCountdownSeconds;

    var nearestStart = Math.floor(activeSec/1000)*1000;
    if (nearestStart < 0) {
        nearestStart = 0;
    }
    var nearestEnd = Math.ceil(activeSec/1000)*1000;
    if (nearestEnd > (cMissionDurationSeconds + cCountdownSeconds)) {  //if greater than total length of tape activity data
        var endRange = cMissionDurationSeconds + cCountdownSeconds;
    } else {
        endRange = nearestEnd;
    }
    if (nearestStart > nearestEnd) {
        trace("!!!!!!!!!!! getTapeActivityRanges bug")
    }
    var tapesActivityfilename = "tape_activity_" + nearestStart.toString() + "-" + (endRange - 1).toString() + ".json";

    if (nearestStart !== gTapesActivityStartIndex) {
        gTapesActivityStartIndex = nearestStart;
        ajaxGetTapesActivityDataRange(tapesActivityfilename);
    }
}
function ajaxGetTapesActivityDataRange(tapesActivityFilename) {
    trace("ajaxGetTapesActivityDataRange()main: "  + tapesActivityFilename.toString());

    var tapeActivityDataPath = cCdnRoot + '/tape_activity/';
    var tapeActivity;
    gTapesActivityRangeArray = [];
    $.when(
        $.getJSON(tapeActivityDataPath + tapesActivityFilename, function(data) {
            tapeActivity = data;})
    ).then(function() {
        gTapesActivityRangeArray = tapeActivity;
    });
}
function setChannelButtonColors() {
    if (gTapesActivityRangeArray.length > 0) {
        var currSecondindex = Math.round(timeStrToSeconds(gCurrMissionTime) + cCountdownSeconds - gTapesActivityStartIndex);
        for (var counter = 1; counter <= 60; counter++) {
            if (!cRedactedChannelsArray.includes(counter)) {
                var buttonSelector = $('#btn-ch' + counter);
                buttonSelector.removeClass('thirtybtn-selected');

                if (gTapesActivityRangeArray[currSecondindex].includes(counter)) {
                    if (!buttonSelector.hasClass('thirtybtn-active')) {
                        buttonSelector.addClass('thirtybtn-active');
                    }
                } else {
                    if (buttonSelector.hasClass('thirtybtn-active')) {
                        buttonSelector.removeClass('thirtybtn-active');
                    }
                }
            }
        }
        $('.btn-channel').removeClass('thirtybtn-selected');
        //if MOCRviz loaded, highlight selected channel
        if (gMOCRToggled) {
            var MOCRvizIframeSelector = $('#MOCRvizIframe')[0];
            var channelnum = MOCRvizIframeSelector.contentWindow.gActiveChannel;
            $('#btn-ch' + channelnum).addClass('thirtybtn-selected');
        }
    }
}

//on document ready
$(document).ready(function() {
    //var myCanvasElement = $('#myCanvas');
    //myCanvasElement.css("height", $('.outer-north').height());  // fix height for broken firefox div height
    //myCanvasElement.css("width", $('.headerRight').width());

    proportionalWidthOnPhotoBlock();
    $('#thirtytrack-container').css({ height: $(window).innerHeight() - 213 });
    initSplash();

    var channelButtons = document.querySelectorAll('.thirtybtn-channel');
    for(var i = 0; i < channelButtons.length; i++) {
        channelButtons[i].addEventListener('click', thirtyButtons_click);
        channelButtons[i].addEventListener('mouseover', thirtyButtons_hover);
        channelButtons[i].addEventListener('mouseleave', thirtyButtons_mouseleave);
    }

    gApplicationReadyIntervalID = setApplicationReadyPoller();

    //throttled scroll detection on commentaryDiv
    var commentaryDiv = $("#commentaryDiv");
    commentaryDiv.scroll($.throttle(function() {
        var commentaryDiv = $("#commentaryDiv");
        if(commentaryDiv.scrollTop() < 300) {
            //trace("top of commentaryDiv reached");
            prependCommentary(25, true);
        } else if(commentaryDiv.scrollTop() + commentaryDiv.innerHeight() >= parseInt(commentaryDiv[0].scrollHeight) - 300) {
            //trace("bottom of commentaryDiv reached");
            appendCommentary(25, true);
        }
    }, 10));

    //throttled scroll detection on utteranceDiv
    var utteranceDiv = $("#utteranceDiv");
    utteranceDiv.scroll($.throttle(function() {
        var utteranceDiv = $("#utteranceDiv");
        if(utteranceDiv.scrollTop() < 300) {
            //trace("top of utteranceDiv reached");
            prependUtterances(25, true);
        } else if(utteranceDiv.scrollTop() + utteranceDiv.innerHeight() >= parseInt(utteranceDiv[0].scrollHeight) - 300) {
            //trace("bottom of utteranceDiv reached");
            appendUtterances(25, true);
        }
    }, 10));
});

// </editor-fold>