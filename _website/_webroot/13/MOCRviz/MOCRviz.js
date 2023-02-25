var cMissionDurationSeconds = 547200; //152 hours
var cCountdownSeconds = 127048;
var cAppStartGET = -102;

// var cTapeCdnRoot = 'https://media.apolloinrealtime.org/A13/MOCR_audio';
// var cTapeCdnRoot = 'https://keycdnmedia.apolloinrealtime.org/A13/MOCR_audio'; //keycdn pulling from dreamhost
// var cTapeCdnRoot = "https://keycdnmediado.apolloinrealtime.org/A13/MOCR_audio"; //keycdn pulling from digitalocean space
var cTapeCdnRoot = "https://apolloinrealtimemedia.nyc3.digitaloceanspaces.com/A13/MOCR_audio"; //digitalocean space
// var cTapeCdnRoot = parent.cMediaCdnRoot + '/MOCR_audio';

var cWebCdnRoot = "";
// var cWebCdnRoot = 'https://apollort-26f5.kxcdn.com';

var cCanvasHeight = 350;
var cWavVerticaloffset = cCanvasHeight / 2 + 60;
var cWavHeight = 100;
var cChannelStrokeWidth = 4;
var cFillerStrokeWidth = 1;

var cTrackInfo = {
  ch1: ["HR1 Datastream", ""],
  ch2: [
    "FLIGHT OPS DIR",
    "Overall responsibility for the mission interface to program Management.",
  ],
  ch3: [
    "MISSION DIRECTOR",
    "The primary interface between NASA Headquarters and the Flight Control Team.",
  ],
  ch4: [
    "DOD MANAGER",
    "Primary interface with NASA for any Department of Defense support required during a mission, including recovery ships and DoD controlled tracking resources.",
  ],
  ch5: [
    "PROCEDURES",
    "Operations and Procedures Officer – Supervised the application of mission rules and detailed implementation of the Mission Control Center/Ground Operational Support Systems mission control procedures.",
  ],
  ch6: [
    "ASST FLIGHT DIR",
    "Responsible to the Flight Director for detailed control of the mission and assumed the duties of the Flight Director in his absence.",
  ],
  ch7: [
    "FLIGHT DIRECTOR [L]",
    "Left seat - Responsible to the Mission Director for detailed control of the mission from launch (tower clear) to splashdown and assumed the duties of the Mission Director in his absence. In real time was responsible to take any actions needed for crew safety and mission success.",
  ],
  ch8: [
    "FLIGHT DIRECTOR [R]",
    "Right seat - Responsible to the Mission Director for detailed control of the mission from launch (tower clear) to splashdown and assumed the duties of the Mission Director in his absence. In real time was responsible to take any actions needed for crew safety and mission success.",
  ],
  ch9: [
    "FLIGHT ACTIVITIES OFFICER",
    "The FAO planned and supported crew activities, checklists, procedures and schedules.",
  ],
  ch10: [
    "NETWORK CTRLR [L]",
    "Network Controller - Had detailed operational control of the world wide Ground Operational Support System (GOSS), which included the tracking stations. (left seat)",
  ],
  ch11: [
    "NETWORK CTRLR [R]",
    "Network Controller - Had detailed operational control of the world wide Ground Operational Support System (GOSS), which included the tracking stations. (right seat)",
  ],
  ch12: [
    "SURGEON [L]",
    "Directed all operational medical activities and crew’s medical status. (left seat)",
  ],
  ch13: [
    "SURGEON [R]",
    "Directed all operational medical activities and crew’s medical status. (right seat)",
  ],
  ch14: [
    "CAPCOM [L]",
    "Spacecraft Communicator – or Capsule Communicator - An astronaut who provided all the voice communications between the ground and the spacecraft. (left seat)",
  ],
  ch15: [
    "CAPCOM [R]",
    "Spacecraft Communicator – or Capsule Communicator - An astronaut who provided all the voice communications between the ground and the spacecraft. (right seat)",
  ],
  ch16: [
    "CSM EECOM",
    "Electrical, Environmental and Consumables Manager - Monitored cryogenic levels for fuel cells, and cabin cooling systems; electrical distribution systems; cabin pressure control systems; and vehicle lighting systems. EECOM originally stood for Electrical, Environmental and COMmunication systems",
  ],
  ch17: [
    "POS EECOM",
    "Electrical, Environmental and Consumables Manager - Monitored cryogenic levels for fuel cells, and cabin cooling systems; electrical distribution systems; cabin pressure control systems; and vehicle lighting systems. EECOM originally stood for Electrical, Environmental and COMmunication systems",
  ],
  ch18: [
    "CSM GNC",
    "Guidance, Navigation, and Controls Systems Engineer - Monitored all vehicle guidance, navigation and control systems. Also responsible for propulsion systems such as the Service Propulsion System and Reaction Control System (RCS).",
  ],
  ch19: [
    "RETRO",
    "Retrofire Officer - Drew up abort plans and was responsible for determination of retrofire times. During lunar missions the RETRO planned and monitored Trans Earth Injection (TEI) maneuvers, where the Apollo Service Module fired its engine to return to Earth from the Moon.",
  ],
  ch20: [
    "FIDO",
    "Flight Dynamics Officer - Responsible for the flight path of the space vehicle, both atmospheric and orbital. During lunar missions the FDO was also responsible for the lunar trajectory. The FDO monitored vehicle performance during the powered flight phase and assessed abort modes, calculated orbital maneuvers and resulting trajectories, and monitored vehicle flight profile and energy levels during re-entry.",
  ],
  ch21: [
    "GUIDO [L]",
    "Guidance Officer - Monitored onboard navigational systems and onboard guidance computer software. Responsible for determining the position of the spacecraft in space. One well-known Guidance officer was Steve Bales, who gave the GO call when the Apollo 11 guidance computer came close to overloading during the first lunar descent. (left seat)",
  ],
  ch22: [
    "GUIDO [R]",
    "Guidance Officer - Monitored onboard navigational systems and onboard guidance computer software. Responsible for determining the position of the spacecraft in space. One well-known Guidance officer was Steve Bales, who gave the GO call when the Apollo 11 guidance computer came close to overloading during the first lunar descent. (right seat)",
  ],
  ch23: [
    "CCATS LOAD CONTROL",
    "Communications, Command and Telemetry Support, Command Load Controller.",
  ],
  ch24: [
    "CCATS RTC",
    "Communications, Command and Telemetry Support, Real-Time Command Controller.",
  ],
  ch25: ["CCATS CMD", "Communications, Command and Telemetry Support, Command Controller."],
  ch26: [
    "CCATS TIC",
    "Communications, Command and Telemetry Support, Telemetry Instrumentation Contoller.",
  ],
  ch27: ["CCATS TM", "Communications, Command and Telemetry Support, Telemetry Controller."],
  ch28: ["TRACK [L]", "Instrumentation Tracking Controller."],
  ch29: ["TRACK [R]", "Instrumentation Tracking Controller, Unified S-Band."],
  ch30: ["HR1 VOICE ANNOTATION", ""],
  ch31: ["HR2 Datastream", ""],
  ch32: [
    "RECOVERY",
    "NASA Recovery Officer - In charge of the Recovery Operations Control Room (ROCR).",
  ],
  ch33: [
    "ASST NASA RCVY COORD",
    "NASA Assistant Recovery Officer - Taking the lead for interfacing with other ROCR personnel.",
  ],
  ch34: [
    "RECOVERY STATUS",
    "Recovery Operations Control Room (ROCR), Recovery Status Monitor - Assembling and displaying, on ROCR group displays, information on recovery force positions and status, pertinent recovery weather data and significant mission events.",
  ],
  ch35: [
    "RECOVERY EVALUATOR",
    "Recovery Operations Control Room (ROCR), Evaluator / Display Controller - Assimilating and evaluating all data necessary to select the most desirable target points for any situation and recommending them to the Recovery Officer.",
  ],
  ch36: ["DOD COORD", ""],
  ch37: ["DOD PRIMARY OP", ""],
  ch38: ["DOD MANAGER [RCVY]", ""],
  ch39: ["DOD EXEC", ""],
  ch40: ["DOD ASST FOR COMM 1", ""],
  ch41: ["DOD PIO", ""],
  ch42: ["COMM TECH [3RD FL]", ""],
  ch43: ["COMM CTRLR [3RD FL]", ""],
  ch44: ["SPACE ENVIRONMENT", "Supplied information on meteorological and space radiation."],
  ch45: [
    "COMPUTER SUPERVISOR",
    "Apollo Guidance Computer Supervisor is in overall control of the RTCC Complex and its associated mission computers Often pronounced 'computer soup'.",
  ],
  ch46: [
    "SPAN",
    "Spacecraft Analysis Room - Official interface for the Manager of the Apollo Spaceflight Program Office. Located on the 3rd floor the mission control building.",
  ],
  ch47: [
    "BOOSTER [L]",
    "Monitored and evaluated performance of propulsion-related aspects of the launch vehicle during prelaunch and ascent. During the Apollo program there were three Booster positions, who worked only until Trans Lunar Injection (TLI); after that, their consoles were vacated. Booster had the power to send an abort command to the spacecraft. All Booster technicians were employed at the Marshall Space Flight Center and reported to JSC for the launches. (left seat)",
  ],
  ch48: [
    "BOOSTER [C]",
    "Monitored and evaluated performance of propulsion-related aspects of the launch vehicle during prelaunch and ascent. During the Apollo program there were three Booster positions, who worked only until Trans Lunar Injection (TLI); after that, their consoles were vacated. Booster had the power to send an abort command to the spacecraft. All Booster technicians were employed at the Marshall Space Flight Center and reported to JSC for the launches. (center seat)",
  ],
  ch49: [
    "BOOSTER [R]",
    "Monitored and evaluated performance of propulsion-related aspects of the launch vehicle during prelaunch and ascent. During the Apollo program there were three Booster positions, who worked only until Trans Lunar Injection (TLI); after that, their consoles were vacated. Booster had the power to send an abort command to the spacecraft. All Booster technicians were employed at the Marshall Space Flight Center and reported to JSC for the launches. (right seat)",
  ],
  ch50: ["FLIGHT DIRECTOR LOOP", "FD clean voice-only recording of Flight Director [R]"],
  ch51: ["AFD CONF LOOP", "Assistant Flight Director - Comm line."],
  ch52: ["GOSS 2 LOOP", "Ground Operational Support System (GOSS) - Comm line."],
  ch53: [
    "INCO",
    "Instrumentation and Communications Officer – With the advent of dual spacecraft operations, lunar surface operations, science TV, and extensive data recovery, a new operating position was added, beginning with the Apollo 11 mission.",
  ],
  ch54: ["MOCR DYN LOOP", "Comm line."],
  ch55: ["GOSS CONF LOOP", "Ground Operational Support System (GOSS) - Comm line."],
  ch56: ["GOSS 4 LOOP", "Ground Operational Support System (GOSS) - Comm line."],
  ch57: ["LM GNC", "(CONTROL) Lunar Module Guidance, Navigation, and Controls Systems Engineer."], //LM GNC ENGINEER
  ch58: [
    "TELMU",
    "(LM EECOM) Lunar Module Electrical, Environmental and Consumables Management Engineer.",
  ], //LM EECOM ENGINEER
  ch59: ["EXPMT ACTIVITIES OFSR", "Experiments Officer."],
  ch60: ["HR2 VOICE ANNOTATION", ""],
};

var cRedactedChannelsArray = [1, 4, 10, 30, 31, 36, 37, 38, 39, 40, 41, 60];
var cAvailableChannelsArray = [
  2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  32, 33, 34, 35, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
];

var cColors = {
  activeLine: "#636363",
  activeLineSelectedChannel: "#7cb7e0",
  // activeLineSelectedChannel: '#92d3ff',
  inactiveLine: "#292929",
  inactiveLineSelectedChannel: "#214557",
  fillerLine: "#000000",
  cursorColor: "red",
  cursorFillColor: "#000000",
  tooltipColor: "#DDDDDD",
  tooltipFillColor: "#000000",
};

var gTapeRangesHR1 = [];
var gTapeRangesHR2 = [];
var gActiveTape = "T867";
var gActiveChannel = 14;
// var gActiveChannel = 52;
var gTapesActivityRangeArray = [];
var gTapesActivityStartIndex;
var gActiveTapesActivityFilenames = ["", "", ""];
var gGettingTapeActivity = false;
var gCurrentlyPlayingTape = "";

var gCurrGETSeconds = cAppStartGET;
var gLastRoundedGET = cAppStartGET;

var gChannelLinesGroup;
var gTimeCursorGroup;
var gChannelNameGroup;

var gWavDataLoaded = false;

var gWaveform512;
var gPaperWaveformGroup;
var gLastWaveformFullDrawGET = -1000000;
var gLastWaveformOnFrameGET = -1000000;
var gWaveformRefresh = false;
var gLastChannelsFullDrawGET = -1000000;
var gLastChannelsOnFrameStartGETSeconds = -1000000;

var gTool;
var gTooltipGroup;
var gHoverHighlightGroup;
// var gCurrGETSeconds = -74768; //start at beginning of countdown

var gPlayer;
var gOnplaying = true;
var gOnpause = false;
var gWaitForPlayer = -1;

var gChannelbuttonsHeight = 0;

// current channel transcript
var cBackground_color_active = "#1e1e1e";
var gTranscriptData = [];
var gTranscriptDataLookup = [];
var gTranscriptIndex = [];
var gTranscriptDisplayStartIndex;
var gTranscriptDisplayEndIndex;
var gCurrentHighlightedTranscriptIndex;
var gLastTranscriptTimeId = "";

window.onload = function () {
  positionChannelButtons();
  positionIsometricElements();

  gPlayer = document.getElementById("audio-element");
  paper.install(window);

  $.when(ajaxGetTapeRangeData()).done(function () {
    trace("APPREADY: Tape Range data loaded");

    mainApplication();
  });

  document.getElementById("myCanvas").addEventListener("mouseleave", function (event) {
    trace("canvas mouseleave triggered");
    gTooltipGroup.removeChildren();
    channelButtons_mouseleave();
    isometric_dots_mouseleave();
  });

  var channelButtons = document.querySelectorAll(".btn-channel");
  for (var i = 0; i < channelButtons.length; i++) {
    channelButtons[i].addEventListener("click", channelButtons_click);
    channelButtons[i].addEventListener("mouseover", channelButtons_hover);
    channelButtons[i].addEventListener("mouseleave", channelButtons_mouseleave);
  }

  var dotsSelector = document.querySelectorAll(".isometric_dot");
  for (i = 0; i < dotsSelector.length; i++) {
    dotsSelector[i].addEventListener("click", isometric_dots_click);
    dotsSelector[i].addEventListener("mouseover", isometric_dots_hover);
    dotsSelector[i].addEventListener("mouseleave", isometric_dots_mouseleave);
  }

  // add event listener to textBtn, searchBtn, and aboutBtn
  document.getElementById("textBtn").addEventListener("click", () => {
    handleDisplayTabButtonClick("textBtn");
  });
  document.getElementById("searchBtn").addEventListener("click", () => {
    handleDisplayTabButtonClick("searchBtn");
  });
  document.getElementById("aboutBtn").addEventListener("click", () => {
    handleDisplayTabButtonClick("aboutBtn");
  });

  $("#searchInputField").keyup(
    $.throttle(function () {
      performSearch();
    }, 100)
  );

  if (parent.gMobileSite === true && parent.gCurrMissionTime !== undefined) {
    $(".close-btn").css("display", "none");
  }
};

// $(window).on("resize", function() {
//     resizeAndRedrawCanvas();
//     positionChannelButtons();
//     positionIsometricElements();
// });
var gResizeTimer;
$(window).on("resize", function (e) {
  clearTimeout(gResizeTimer);
  gResizeTimer = setTimeout(function () {
    // Run code here, resizing has "stopped"
    if (parent.gMobileSite !== true && parent.gCurrMissionTime !== undefined) {
      resizeAndRedrawCanvas();
      positionChannelButtons();
      positionIsometricElements();
      refreshTapeActivityDisplay(true);
    }
  }, 250);
});

function resizeAndRedrawCanvas() {
  var canvas = document.getElementById("myCanvas");
  var desiredWidth = $(window).width();
  var desiredHeight = cCanvasHeight;

  canvas.width = desiredWidth;
  canvas.height = desiredHeight;

  view.viewSize = new Size(desiredWidth, desiredHeight);
  view.draw();
}

function handleDisplayTabButtonClick(buttonId) {
  if (buttonId === "textBtn") {
    $("#textBtn").addClass("selected");
    $("#searchBtn").removeClass("selected");
    $("#aboutBtn").removeClass("selected");
    $("#transcriptDiv").css("display", "block");
    $("#searchDiv").css("display", "none");
    $("#aboutDiv").css("display", "none");
  } else if (buttonId === "searchBtn") {
    $("#textBtn").removeClass("selected");
    $("#searchBtn").addClass("selected");
    $("#aboutBtn").removeClass("selected");
    $("#transcriptDiv").css("display", "none");
    $("#searchDiv").css("display", "block");
    $("#aboutDiv").css("display", "none");
    $("#searchInputField").focus();
  } else if (buttonId === "aboutBtn") {
    $("#textBtn").removeClass("selected");
    $("#searchBtn").removeClass("selected");
    $("#aboutBtn").addClass("selected");
    $("#transcriptDiv").css("display", "none");
    $("#searchDiv").css("display", "none");
    $("#aboutDiv").css("display", "block");
  }
  return true;
}

function mainApplication() {
  trace("mainApplication ()");
  var canvas = document.getElementById("myCanvas");
  var missionTimeDisplay = document.getElementById("missionTimeDisplay");
  // canvas.width = 1000;
  canvas.height = cCanvasHeight;

  paper.setup(canvas);
  gChannelLinesGroup = new paper.Group();
  gTool = new paper.Tool();
  gTooltipGroup = new paper.Group();
  gHoverHighlightGroup = new paper.Group();
  gTimeCursorGroup = new paper.Group();
  gChannelNameGroup = new paper.Group();

  gTool.onMouseMove = function (event) {
    //if in the top mulitrack area
    if (
      event.point.y > 0 &&
      event.point.y < cAvailableChannelsArray.length * (cChannelStrokeWidth + cFillerStrokeWidth)
    ) {
      // paper.project.activeLayer.children['tooltip'].remove();
      gTooltipGroup.removeChildren();

      var availableChannelsIndex = Math.round(
        (event.point.y - cChannelStrokeWidth / 2) / (cChannelStrokeWidth + cFillerStrokeWidth)
      );
      availableChannelsIndex =
        availableChannelsIndex > cAvailableChannelsArray.length - 1
          ? cAvailableChannelsArray.length - 1
          : availableChannelsIndex;
      availableChannelsIndex = availableChannelsIndex < 0 ? 0 : availableChannelsIndex;
      var hoverChannelNum = cAvailableChannelsArray[availableChannelsIndex];

      var tooltipText = new paper.PointText({
        justification: "left",
        fontWeight: "bold",
        // fontFamily: graphFontFamily,
        fontSize: 11,
        fillColor: cColors.tooltipColor,
      });

      tooltipText.content =
        "ch" +
        hoverChannelNum +
        " " +
        cTrackInfo["ch" + hoverChannelNum][0] +
        " \n" +
        secondsToTimeStr(gCurrGETSeconds - Math.round($(window).width() / 2) + event.point.x);
      tooltipText.point = new paper.Point(event.point.x + 20, event.point.y + 13);
      gTooltipGroup.addChild(tooltipText);

      var tooltip = new paper.Path.Rectangle(
        tooltipText.bounds.x - 5,
        tooltipText.bounds.y - 5,
        tooltipText.bounds.width + 10,
        tooltipText.bounds.height + 10
      );
      tooltip.fillColor = cColors.tooltipFillColor;
      tooltip.strokeColor = cColors.tooltipColor;

      gTooltipGroup.addChild(tooltip);
      tooltip.moveBelow(tooltipText);
      gTooltipGroup.bringToFront();

      //draw hover highlight line
      var xCoord = 0;
      var yCoord =
        availableChannelsIndex * (cChannelStrokeWidth + cFillerStrokeWidth) +
        cChannelStrokeWidth / 2;

      gHoverHighlightGroup.removeChildren();
      var hoverLine = new paper.Path.Line({
        from: [xCoord, yCoord],
        to: [Math.round($(window).width()), yCoord],
        strokeWidth: cChannelStrokeWidth,
        // name: 'ch' + channelCount
      });
      hoverLine.strokeColor = new paper.Color(0.57255, 0.82745, 1.0, 0.6);
      gHoverHighlightGroup.addChild(hoverLine);

      //highlight hovered button
      $(".btn-channel").removeClass("btn-hover");
      $("#btn-ch" + hoverChannelNum).addClass("btn-hover");

      //highlight hovered dot
      $(".isometric_dot").removeClass("dot-hover");
      $("#dot" + hoverChannelNum).addClass("dot-hover");

      //highlight parent button
      if (parent.gMobileSite !== true && parent.gCurrMissionTime !== undefined) {
        parent.thirtyButtons_hover_fromMOCRviz(hoverChannelNum);
      }
    } else {
      gTooltipGroup.removeChildren();
      gHoverHighlightGroup.removeChildren();

      //remove button hovers
      for (var counter = 1; counter <= 60; counter++) {
        var buttonId = "#btn-ch" + counter;
        var buttonSelector = $(buttonId);
        buttonSelector.removeClass("btn-hover");
      }

      if (parent.gMobileSite !== true && parent.gCurrMissionTime !== undefined) {
        parent.thirtyButtons_mouseleave_fromMOCRviz();
      }
    }
  };

  gTool.onMouseDown = function (event) {
    if (
      event.point.y > 0 &&
      event.point.y < cAvailableChannelsArray.length * (cChannelStrokeWidth + cFillerStrokeWidth)
    ) {
      //if in the top mulitrack area
      //determine channel clicked
      ga("send", "event", "MOCRviz", "click", "channel");
      var availableChannelsIndex = Math.round(
        (event.point.y - cChannelStrokeWidth / 2) / (cChannelStrokeWidth + cFillerStrokeWidth)
      );
      availableChannelsIndex =
        availableChannelsIndex > cAvailableChannelsArray.length - 1
          ? cAvailableChannelsArray.length - 1
          : availableChannelsIndex;
      availableChannelsIndex = availableChannelsIndex < 0 ? 0 : availableChannelsIndex;
      var hoverChannelNum = "ch" + cAvailableChannelsArray[availableChannelsIndex];

      gActiveChannel = parseInt(hoverChannelNum.substr(2, 2));
      loadChannelSoundfile();

      //set GET
      var mouseGEToffset = event.point.x - Math.round($(window).width() / 2);
    } else {
      //if in the wav form area
      ga("send", "event", "MOCRviz", "click", "wav");
      mouseGEToffset =
        (event.point.x - Math.round($(window).width() / 2)) * gWaveform512.seconds_per_pixel;
    }
    gCurrGETSeconds = gCurrGETSeconds + mouseGEToffset;
    gCurrGETSeconds =
      gCurrGETSeconds < cCountdownSeconds * -1 ? cCountdownSeconds * -1 : gCurrGETSeconds;
    if (gCurrGETSeconds > cMissionDurationSeconds + cCountdownSeconds) {
      gCurrGETSeconds = cMissionDurationSeconds + cCountdownSeconds;
    }
    gLastRoundedGET = Math.round(gCurrGETSeconds);

    if (parent.gCurrMissionTime !== "" && parent.gCurrMissionTime !== undefined) {
      parent.seekToTime(secondsToTimeId(gCurrGETSeconds));
    }

    playFromCurrGET(false);
    refreshTapeActivityDisplay(true);
    gWaveformRefresh = true;
    setControllerDetails(gActiveChannel);
  };

  // hide player element if in iframe
  if (parent.gCurrMissionTime === undefined) {
    $("#audioDiv").show();
  }

  // On video playing toggle values
  gPlayer.onplaying = function () {
    gOnplaying = true;
    gOnpause = false;
  };

  // On video pause toggle values
  gPlayer.onpause = function () {
    gOnplaying = false;
    gOnpause = true;
  };

  gPaperWaveformGroup = new paper.Group();

  // SYNC WITH PARENT GET CLOCK
  if (parent.gCurrMissionTime !== "" && parent.gCurrMissionTime !== undefined) {
    gCurrGETSeconds = timeStrToSeconds(parent.gCurrMissionTime);
  }

  //throttled scroll detection on transcriptDiv
  var transcriptDiv = $("#transcriptDiv");
  transcriptDiv.scroll(
    $.throttle(function () {
      var transcriptDiv = $("#transcriptDiv");
      if (transcriptDiv.scrollTop() < 300) {
        //trace("top of transcriptDiv reached");
        prependTranscript(25, true);
      } else if (
        transcriptDiv.scrollTop() + transcriptDiv.innerHeight() >=
        parseInt(transcriptDiv[0].scrollHeight) - 300
      ) {
        //trace("bottom of transcriptDiv reached");
        appendTranscript(25, true);
      }
    }, 10)
  );

  getChannelParameter();
  resizeAndRedrawCanvas();
  loadChannelSoundfile();
  playFromCurrGET(true);
  refreshTapeActivityDisplay(true);
  setControllerDetails(gActiveChannel);
  window.setInterval(function () {
    //trace("setIntroTimeUpdatePoller()");
    frameUpdateOnTimer();
  }, 100);
  window.setInterval(function () {
    if (!gPlayer.paused) {
      // scroll the transcript
      var timeId = timeStrToTimeId(secondsToTimeStr(gCurrGETSeconds));
      scrollTranscriptToTimeId(timeId);
    }
  }, 1000);
}

function getChannelParameter() {
  var paramChannel = $.getUrlVar("ch");
  paramChannel = decodeURIComponent(paramChannel);
  if (paramChannel !== "undefined") {
    gActiveChannel = parseInt(paramChannel);
  }
}

function frameUpdateOnTimer() {
  if (parent.gCurrMissionTime !== undefined) {
    if (parent.gPlaybackState === "normal" && gPlayer.paused) {
      var playPromise = gPlayer.play();
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            // console.log("PLAY started successfully");
            // Automatic playback started!
          })
          .catch(function (error) {
            // Automatic playback failed.
            // Show a UI element to let the user manually start playback.
            // console.log(error);
            // alert("hello!");
          });
      }
    }
    if (parent.gPlaybackState !== "normal" && !gPlayer.paused) {
      gPlayer.pause();
    }
  }

  //wait for gPlayer to be ready before seeking to player position (safari fix)
  if (gWaitForPlayer !== -1) {
    if (!isNaN(gPlayer.duration)) {
      gPlayer.currentTime = gWaitForPlayer;
      playAudio();
      gWaitForPlayer = -1;
      trace("frameUpdateOnTimer(): play command issued");
      setTimeout(function () {
        trace("frameUpdateOnTimer(): timeout fired to refreshTapeActivityDisplay");
        refreshTapeActivityDisplay(true);
      }, 500);
    }
  }
  if (!gPlayer.paused) {
    // SYNC WITH PARENT GET CLOCK
    if (parent.gCurrMissionTime !== "" && parent.gCurrMissionTime !== undefined) {
      var parentMissionTimeSeconds = timeStrToSeconds(parent.gCurrMissionTime);
      if (
        parentMissionTimeSeconds >= gCurrGETSeconds - 2 &&
        parentMissionTimeSeconds <= gCurrGETSeconds + 2
      ) {
        // then we're close enough, don't correct the time
      } else {
        gCurrGETSeconds = parentMissionTimeSeconds;
        loadChannelSoundfile();
        playFromCurrGET(false);
        refreshTapeActivityDisplay(true);
        drawTimeCursor();
      }
    }

    var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
    var currSeconds = gPlayer.currentTime;
    currSeconds = currSeconds === undefined ? 0 : currSeconds;
    gCurrGETSeconds = currSeconds + timeStrToSeconds(tapeData[2]);

    var missionTimeDisplay = document.getElementById("missionTimeDisplay");
    missionTimeDisplay.innerHTML = secondsToTimeStr(gCurrGETSeconds);
    gLastRoundedGET = Math.round(gCurrGETSeconds);

    //update active channels display
    refreshTapeActivityDisplay(false);

    if (gWavDataLoaded) {
      var pixelsToMove =
        (gLastWaveformOnFrameGET - gCurrGETSeconds) * gWaveform512.pixels_per_second;
      if (
        gWaveformRefresh ||
        gCurrGETSeconds >
          gLastWaveformFullDrawGET + $(window).width() * gWaveform512.seconds_per_pixel
      ) {
        gWaveformRefresh = false;
        gLastWaveformFullDrawGET = gCurrGETSeconds;
        gLastWaveformOnFrameGET = gCurrGETSeconds;
        gPaperWaveformGroup.removeChildren();

        var wavePath1 = new paper.Path({
          strokeWidth: 0.1,
          strokeColor: cColors.activeLineSelectedChannel,
          fillColor: cColors.activeLineSelectedChannel,
          name: "wav",
        });

        var offsetStart =
          Math.round(gPlayer.currentTime * gWaveform512.pixels_per_second) -
          Math.round($(window).width() / 2);
        var lineXVal = Math.round($(window).width() / 2);
        if (offsetStart < 0) {
          gWaveformRefresh = true;
          lineXVal = Math.round($(window).width() / 2) + offsetStart;

          // Draw play cursor over wav
          var startPoint = new paper.Point(lineXVal + 0.5, cCanvasHeight - 100);
          var endPoint = new paper.Point(lineXVal + 0.5, cCanvasHeight - 10);
          var aLine = new paper.Path.Line(startPoint, endPoint);
          aLine.strokeColor = cColors.cursorColor;
          aLine.strokeWidth = 1;
          aLine.name = "offsetCursor";

          gTimeCursorGroup.addChild(aLine);

          offsetStart = 0;
        }
        var offsetEnd = offsetStart + $(window).width() * 2;

        gWaveform512.offset(offsetStart, offsetEnd);

        gWaveform512.min.forEach(function (val, x) {
          wavePath1.add(
            new Point(x + 0.1, interpolateHeight(cWavHeight, val) + 0.5 + cWavVerticaloffset)
          );
        });
        gWaveform512.max.reverse().forEach(function (val, x) {
          wavePath1.add(
            new Point(
              gWaveform512.offset_length - x - 0.5,
              interpolateHeight(cWavHeight, val) - 0.5 + cWavVerticaloffset
            )
          );
        });
        // var wavePath1Raster = wavePath1.rasterize();
        gPaperWaveformGroup.addChild(wavePath1);
        gPaperWaveformGroup.moveBelow(gTimeCursorGroup);
      } else if (Math.abs(pixelsToMove) > 1) {
        // console.log("wav: " + pixelsToMove);
        gPaperWaveformGroup.translate(new Point(pixelsToMove, 0));
        gLastWaveformOnFrameGET = gCurrGETSeconds;
      }
    }
  }
}

function loadChannelSoundfile() {
  var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);

  if (tapeData.length !== 0 && tapeData[0] !== "T999") {
    gActiveTape = tapeData[0];
    var channel = gActiveChannel > 30 ? gActiveChannel - 30 : gActiveChannel;
    var filename = "DA13_" + tapeData[0] + "_" + tapeData[1] + "_CH" + channel;
    var datFile =
      cTapeCdnRoot +
      "/" +
      "DA13_" +
      tapeData[0] +
      "_" +
      tapeData[1] +
      "_16khz_mp3_16/audiowaveform_512/" +
      filename +
      ".dat";
    var audioFile =
      cTapeCdnRoot +
      "/" +
      "DA13_" +
      tapeData[0] +
      "_" +
      tapeData[1] +
      "_16khz_mp3_16/" +
      filename +
      ".mp3";

    if (gPlayer.src.substr(gPlayer.src.length - 20) !== audioFile.substr(audioFile.length - 20)) {
      trace("loading tape: " + audioFile + " :datFile: " + datFile);
      gPlayer.src = audioFile;
      gPlayer.load();
      gWavDataLoaded = false;
      ajaxGetWaveData(datFile);
      drawChannelName();
      // load the transcript for this channel too
      resetAndLoadTranscript();
    } else {
      // trace("loading tape: gPlayer src already same as audioFile. Do not reload audio element or dat file.")
    }
  } else {
    trace("loadChannelSoundfile(): !!!!!!!!!!!!! No tape audio for this channel at this time");
  }
}

function drawChannelName() {
  gChannelNameGroup.removeChildren();
  var channelText = new paper.PointText({
    justification: "left",
    fontSize: 14,
    fillColor: cColors.tooltipColor,
    strokeColor: cColors.tooltipColor,
    strokeWidth: 0.1,
  });
  channelText.content = cTrackInfo["ch" + gActiveChannel][0];
  channelText.point = new paper.Point(10, cCanvasHeight - 75);
  var cornerSize = new paper.Size(3, 3);

  var channelTextRect = new paper.Path.RoundRectangle(channelText.bounds, cornerSize);
  channelTextRect.strokeColor = cColors.tooltipColor;
  channelTextRect.fillColor = cColors.tooltipFillColor;
  channelTextRect.scale(1.1, 1.3);

  gChannelNameGroup.addChild(channelTextRect);
  gChannelNameGroup.addChild(channelText);

  // document.getElementById("channelDescription").innerHTML = cTrackInfo['ch' + gActiveChannel][1];
}

function playFromCurrGET(syncWithParent) {
  // trace("playFromCurrGET(): syncWithParent: " + syncWithParent);

  if (syncWithParent) {
    // SYNC WITH PARENT GET CLOCK
    if (parent.gCurrMissionTime !== "" && parent.gCurrMissionTime !== undefined) {
      gCurrGETSeconds = timeStrToSeconds(parent.gCurrMissionTime);
    }
  }
  var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
  if (tapeData[0] !== gCurrentlyPlayingTape) {
    gCurrentlyPlayingTape = tapeData[0];
    loadChannelSoundfile();
  }
  var tapeCueTimeSeconds = gCurrGETSeconds - timeStrToSeconds(tapeData[2]);

  // trace("playFromCurrGET(): gWaitForPlayer: " + tapeCueTimeSeconds);
  gWaitForPlayer = tapeCueTimeSeconds;
}

function refreshTapeActivityDisplay(forceRefresh) {
  if (gWaitForPlayer === -1) {
    var calcedTapesActivityFilenames = getTapeActivityRanges(gCurrGETSeconds);
    if (
      calcedTapesActivityFilenames[0] !== gActiveTapesActivityFilenames[0] ||
      forceRefresh === true
    ) {
      trace("refreshTapeActivityDisplay()MOCRviz: gCurrGETSeconds: " + gCurrGETSeconds);
      ajaxGetTapesActivityDataRange(calcedTapesActivityFilenames);
    } else {
      drawChannels(false);
      drawTimeCursor();
      setChannelButtonAndDotColors();
    }
  }
}

//CANVAS ---
function drawChannels(forceRefresh) {
  var startGETSeconds = gCurrGETSeconds - Math.round($(window).width() / 2);
  var displayRangeStart = startGETSeconds + cCountdownSeconds - gTapesActivityStartIndex - 1;
  var durationSeconds = gTapesActivityRangeArray.length - displayRangeStart;

  var displayRangeEnd = displayRangeStart + durationSeconds;

  var pixelsToMove = gLastChannelsOnFrameStartGETSeconds - startGETSeconds;
  if (
    (forceRefresh || startGETSeconds > gLastChannelsFullDrawGET + $(window).width()) &&
    gTapeRangesHR1 !== []
  ) {
    gChannelLinesGroup.removeChildren();
    var partialSecond = gCurrGETSeconds % 1;

    gLastChannelsFullDrawGET = startGETSeconds;
    gLastChannelsOnFrameStartGETSeconds = startGETSeconds;

    cAvailableChannelsArray.forEach(function (channelNum, x) {
      //get interval start/end based on GET

      var lineGroup = new paper.Group();
      var xCoord = partialSecond;
      var yCoord = x * (cChannelStrokeWidth + cFillerStrokeWidth) + cChannelStrokeWidth / 2;
      var currSegStart = -1;
      var prevXCoordActive = false;

      //draw inactive line background
      var inactiveLine = new paper.Path.Line({
        from: [xCoord, yCoord],
        to: [durationSeconds, yCoord],
        strokeWidth: cChannelStrokeWidth,
        // name: 'ch' + channelCount
      });
      if (channelNum === gActiveChannel) {
        inactiveLine.strokeColor = cColors.inactiveLineSelectedChannel;
      } else {
        inactiveLine.strokeColor = cColors.inactiveLine;
      }
      lineGroup.addChild(inactiveLine);
      for (var i = Math.round(displayRangeStart); i < displayRangeEnd; i++) {
        if (i >= 0) {
          if (gTapesActivityRangeArray[i].includes(channelNum)) {
            if (!prevXCoordActive) {
              currSegStart = xCoord;
              prevXCoordActive = true;
            }
          } else {
            if (prevXCoordActive) {
              var aLine = new paper.Path.Line({
                from: [currSegStart, yCoord],
                to: [xCoord, yCoord],
                strokeWidth: cChannelStrokeWidth,
                // name: "ch" + tapeChannelNum
              });
              if (channelNum === gActiveChannel) {
                aLine.strokeColor = cColors.activeLineSelectedChannel;
              } else {
                aLine.strokeColor = cColors.activeLine;
              }
              lineGroup.addChild(aLine);
              prevXCoordActive = false;
            }
          }
        }
        xCoord++;
      }
      if (prevXCoordActive) {
        aLine = new paper.Path.Line({
          from: [currSegStart, yCoord],
          to: [xCoord, yCoord],
          strokeWidth: cChannelStrokeWidth,
          // name: "ch" + tapeChannelNum
        });
        if (channelNum === gActiveChannel) {
          aLine.strokeColor = cColors.activeLineSelectedChannel;
        } else {
          aLine.strokeColor = cColors.activeLine;
        }
        lineGroup.addChild(aLine);
      }

      lineGroup.name = "ch" + channelNum;
      gChannelLinesGroup.addChild(lineGroup);
    });
  } else if (Math.abs(pixelsToMove) > 1) {
    // console.log("channels: " + pixelsToMove);
    gChannelLinesGroup.translate(new Point(pixelsToMove, 0));
    gLastChannelsOnFrameStartGETSeconds = startGETSeconds;
  }
}

function drawTimeCursor() {
  gTimeCursorGroup.removeChildren();
  var startPoint = new paper.Point($(window).width() / 2 + 0.5, 0);
  var endPoint = new paper.Point($(window).width() / 2 + 0.5, cCanvasHeight - 10);
  var aLine = new paper.Path.Line(startPoint, endPoint);
  aLine.strokeColor = cColors.cursorColor;
  aLine.strokeWidth = 1;
  aLine.name = "timeCursor";
  gTimeCursorGroup.addChild(aLine);

  var timeText = new paper.PointText({
    justification: "left",
    fontFamily: "Roboto Mono",
    fontWeight: "bold",
    fontSize: 12,
    fillColor: cColors.cursorColor,
  });
  timeText.content = secondsToTimeStr(gCurrGETSeconds);
  timeText.point = new paper.Point(
    $(window).width() / 2 - timeText.bounds.width / 2,
    cCanvasHeight - 10
  );
  var cornerSize = new paper.Size(3, 3);
  var timeTextRect = new paper.Path.RoundRectangle(timeText.bounds, cornerSize);
  //var timeTextRect = new paper.Path.Rectangle(timeText.bounds);
  timeTextRect.strokeColor = cColors.cursorColor;
  timeTextRect.fillColor = cColors.cursorFillColor;
  //timeTextRect.opacity = 0.5;
  timeTextRect.scale(1.1, 1.2);
  gTimeCursorGroup.addChild(timeTextRect);
  gTimeCursorGroup.addChild(timeText);
}

function positionChannelButtons() {
  //set alt text
  for (var counter = 1; counter < 60; counter++) {
    var altText = cTrackInfo["ch" + counter][0] + ": " + cTrackInfo["ch" + counter][1];
    $("#btn-ch" + counter).attr("title", altText);
  }

  var buttonWidth = 75;
  var buttonHeight = 18;
  var buttonGap = 1;
  var aisleGap = 20;
  var rowGap = 40;

  //trench
  var x = 60;
  var y = 0;
  var xsub = 0;

  $("#btndiv-ch47").css({ left: x + "px", top: y + "px", display: "none" }); //BOOSTER
  $("#btn-ch47").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch48").css({ left: xsub + "px", top: y + buttonHeight + "px", display: "none" }); //[C]
  $("#btn-ch48").css({ width: buttonWidth / 2 - 1 + "px" });
  $("#btndiv-ch49").css({
    left: xsub + buttonWidth / 2 + "px",
    top: y + buttonHeight + "px",
    display: "none",
  }); //[R]
  $("#btn-ch49").css({ width: buttonWidth / 2 + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch19").css({ left: x + "px", top: y + "px", display: "none" }); //RETRO
  $("#btn-ch19").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + aisleGap;
  $("#btndiv-ch20").css({ left: x + "px", top: y + "px", display: "none" }); //FIDO
  $("#btn-ch20").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch21").css({ left: x + "px", top: y + "px", display: "none" }); //GUIDO
  $("#btn-ch21").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch22").css({
    left: xsub + buttonWidth / 2 + "px",
    top: y + buttonHeight + "px",
    display: "none",
  }); //[R]
  $("#btn-ch22").css({ width: buttonWidth / 2 + "px" });

  y = y + rowGap;

  //row 2
  x = 50;
  aisleGap = 40;
  $("#btndiv-ch12").css({ left: x + "px", top: y + "px", display: "none" }); //SURGEON
  $("#btn-ch12").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch13").css({
    left: xsub + buttonWidth / 2 + "px",
    top: y + buttonHeight + "px",
    display: "none",
  }); //[R]
  $("#btn-ch13").css({ width: buttonWidth / 2 + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch14").css({ left: x + "px", top: y + "px", display: "none" }); //CAPCOM
  $("#btn-ch14").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch15").css({
    left: xsub + buttonWidth / 2 + "px",
    top: y + buttonHeight + "px",
    display: "none",
  }); //[R]
  $("#btn-ch15").css({ width: buttonWidth / 2 + "px" });
  x = x + buttonWidth + aisleGap;
  buttonWidth = buttonWidth - 10;
  $("#btndiv-ch17").css({ left: x + "px", top: y + "px", display: "none" }); //POS EECOM
  $("#btn-ch17").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  buttonWidth = buttonWidth - 20;
  $("#btndiv-ch18").css({ left: x + "px", top: y + "px", display: "none" }); //CSM GNC
  $("#btn-ch18").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  buttonWidth = buttonWidth + 20;
  $("#btndiv-ch58").css({ left: x + "px", top: y + "px", display: "none" }); //LM EECOM (TELMU)
  $("#btn-ch58").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch57").css({ left: x + "px", top: y + "px", display: "none" }); //LM GNC
  $("#btn-ch57").css({ width: buttonWidth + "px" });

  y = y + rowGap;
  //row 3
  x = 0;
  $("#btndiv-ch16").css({ left: x + "px", top: y + "px", display: "none" }); //CSM EECOM
  $("#btn-ch16").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch5").css({ left: x + "px", top: y + "px", display: "none" }); //PRO
  $("#btn-ch5").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch6").css({ left: x + "px", top: y + "px", display: "none" }); //AFD
  $("#btn-ch6").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + aisleGap;
  buttonWidth = buttonWidth + 10;
  $("#btndiv-ch50").css({ left: x + "px", top: y + "px", display: "none" }); //FLIGHT
  $("#btn-ch50").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch7").css({ left: xsub + "px", top: y + buttonHeight + "px", display: "none" }); //FLIGHT L
  $("#btn-ch7").css({ width: buttonWidth / 2 - 1 + "px" });
  $("#btndiv-ch8").css({
    left: xsub + buttonWidth / 2 + "px",
    top: y + buttonHeight + "px",
    display: "none",
  }); //FLIGHT R
  $("#btn-ch8").css({ width: buttonWidth / 2 + "px" });

  x = x + buttonWidth + aisleGap;
  xsub = x;
  $("#btndiv-ch9").css({ left: x + "px", top: y + "px", display: "none" }); //FAO
  $("#btn-ch9").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch11").css({ left: x + "px", top: y + "px", display: "none" }); //NETWORK
  $("#btn-ch11").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch42").css({ left: xsub + "px", top: y + buttonHeight + "px", display: "none" }); //COMM TECH
  $("#btn-ch42").css({ width: buttonWidth / 2 - 1 + "px" });
  $("#btndiv-ch43").css({
    left: xsub + buttonWidth / 2 + "px",
    top: y + buttonHeight + "px",
    display: "none",
  }); //COMM CTRLR
  $("#btn-ch43").css({ width: buttonWidth / 2 + "px" });

  y = y + rowGap;
  //row 4
  x = 271;
  $("#btndiv-ch2").css({ left: x + "px", top: y + "px", display: "none" }); //DIR FLIGHT OPS
  $("#btn-ch2").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + aisleGap;
  $("#btndiv-ch3").css({ left: x + "px", top: y + "px", display: "none" }); //MISSION DIR
  $("#btn-ch3").css({ width: buttonWidth + "px" });

  y = y + rowGap;
  //backrooms 1
  buttonWidth = 80;
  x = 0;
  $("#btndiv-ch44").css({ left: x + "px", top: y + "px" }); //SPACE ENV
  $("#btn-ch44").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch45").css({ left: x + "px", top: y + "px" }); //COMP SUP
  $("#btn-ch45").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch46").css({ left: x + "px", top: y + "px" }); //SPAN
  $("#btn-ch46").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch59").css({ left: x + "px", top: y + "px" }); //EXPMT
  $("#btn-ch59").css({ width: buttonWidth + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch53").css({ left: x + "px", top: y + "px", display: "none" }); //INCO
  $("#btn-ch53").css({ width: buttonWidth + "px" });

  y = y + rowGap / 2 - 2;
  //backrooms 2
  buttonWidth = 110;
  x = 0;

  $("#btndiv-ch32").css({ left: x + "px", top: y + "px" }); //RCVY
  $("#btn-ch32").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch33").css({ left: xsub + "px", top: y + buttonHeight + "px" }); //ASST
  $("#btn-ch33").css({ width: buttonWidth / 3 - 1 + "px" });
  $("#btndiv-ch34").css({ left: xsub + buttonWidth / 3 + "px", top: y + buttonHeight + "px" }); //STUS
  $("#btn-ch34").css({ width: buttonWidth / 3 - 1 + "px" });
  $("#btndiv-ch35").css({
    left: xsub + (buttonWidth / 3) * 2 + "px",
    top: y + buttonHeight + "px",
  }); //EVAL
  $("#btn-ch35").css({ width: buttonWidth / 3 + "px" });
  x = x + buttonWidth + buttonGap;
  buttonWidth = buttonWidth + 20;
  $("#btndiv-ch23").css({ left: x + "px", top: y + "px" }); //CCATS
  $("#btn-ch23").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch24").css({ left: xsub + "px", top: y + buttonHeight + "px" }); //RTC
  $("#btn-ch24").css({ width: buttonWidth / 4 - 1 + "px" });
  $("#btndiv-ch25").css({ left: xsub + buttonWidth / 4 + "px", top: y + buttonHeight + "px" }); //CMD
  $("#btn-ch25").css({ width: buttonWidth / 4 - 1 + "px" });
  $("#btndiv-ch26").css({
    left: xsub + (buttonWidth / 4) * 2 + "px",
    top: y + buttonHeight + "px",
  }); //TIC
  $("#btn-ch26").css({ width: buttonWidth / 4 - 1 + "px" });
  $("#btndiv-ch27").css({
    left: xsub + (buttonWidth / 4) * 3 + "px",
    top: y + buttonHeight + "px",
  }); //TM
  $("#btn-ch27").css({ width: buttonWidth / 4 + "px" });
  x = x + buttonWidth + buttonGap;
  $("#btndiv-ch51").css({ left: x + "px", top: y + "px" }); //CONF LOOP
  $("#btn-ch51").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch52").css({ left: xsub + "px", top: y + buttonHeight + "px" }); //RTC
  $("#btn-ch52").css({ width: buttonWidth / 4 - 1 + "px" });
  $("#btndiv-ch54").css({ left: xsub + buttonWidth / 4 + "px", top: y + buttonHeight + "px" }); //CMD
  $("#btn-ch54").css({ width: buttonWidth / 4 - 1 + "px" });
  $("#btndiv-ch55").css({
    left: xsub + (buttonWidth / 4) * 2 + "px",
    top: y + buttonHeight + "px",
  }); //TIC
  $("#btn-ch55").css({ width: buttonWidth / 4 - 1 + "px" });
  $("#btndiv-ch56").css({
    left: xsub + (buttonWidth / 4) * 3 + "px",
    top: y + buttonHeight + "px",
  }); //TM
  $("#btn-ch56").css({ width: buttonWidth / 4 + "px" });
  x = x + buttonWidth + buttonGap;
  buttonWidth = 55;
  $("#btndiv-ch28").css({ left: x + "px", top: y + "px" }); //TRACK
  $("#btn-ch28").css({ width: buttonWidth + "px" });
  xsub = x;
  $("#btndiv-ch29").css({ left: xsub + "px", top: y + buttonHeight + "px" }); //[R]
  $("#btn-ch29").css({ width: buttonWidth / 2 + "px" });
  x = x + buttonWidth + buttonGap;

  gChannelbuttonsHeight = y + buttonHeight;
}

function setChannelButtonAndDotColors() {
  var currSecondindex = Math.round(gCurrGETSeconds + cCountdownSeconds - gTapesActivityStartIndex);

  if (gTapesActivityRangeArray.length !== 0) {
    for (var counter = 1; counter <= 60; counter++) {
      var buttonSelector = $("#btn-ch" + counter);
      buttonSelector.removeClass("btn-selected");

      if (gTapesActivityRangeArray[currSecondindex].includes(counter)) {
        if (!buttonSelector.hasClass("btn-active")) {
          buttonSelector.removeClass("btn-inactive");
          buttonSelector.addClass("btn-active");
        }
      } else {
        if (!buttonSelector.hasClass("btn-inactive")) {
          buttonSelector.removeClass("btn-active");
          buttonSelector.addClass("btn-inactive");
        }
      }
    }
    var activeChannelSelector = $("#btn-ch" + gActiveChannel);
    activeChannelSelector.addClass("btn-selected");

    for (counter = 1; counter <= 60; counter++) {
      var dotSelector = $("#dot" + counter);
      dotSelector.removeClass("dot-selected");

      if (gTapesActivityRangeArray[currSecondindex].includes(counter)) {
        if (!dotSelector.hasClass("dot-active")) dotSelector.removeClass("dot-inactive");
        dotSelector.addClass("dot-active");
      } else {
        if (!dotSelector.hasClass("dot-inactive")) dotSelector.removeClass("dot-active");
        dotSelector.addClass("dot-inactive");
      }
    }
    activeChannelSelector = $("#dot" + gActiveChannel);
    activeChannelSelector.addClass("dot-selected");
  }
}

function channelButtons_click() {
  // console.log("select-channel-button clicked: " + $(this).attr('id'));
  gActiveChannel = parseInt(
    $(this)
      .attr("id")
      .substr($(this).attr("id").indexOf("ch") + 2)
  ); //get channel number from button label
  ga("send", "event", "MOCRviz", "click", "channelbutton");
  loadChannelSoundfile();
  playFromCurrGET(true);
  refreshTapeActivityDisplay(true);
  gWaveformRefresh = true;
  setControllerDetails(gActiveChannel);
  resetAndLoadTranscript();
}

function channelButtons_hover(hoverChannelNum) {
  // console.log("select-channel-button hovered: " + $(this).attr('id'));

  if (typeof hoverChannelNum === "object") {
    //ignore mouseclick object, assume this means that it wasn't called from parent
    hoverChannelNum = parseInt(
      $(this)
        .attr("id")
        .substr($(this).attr("id").indexOf("ch") + 2)
    );
  }
  //show button hover

  $(".btn-channel").removeClass("btn-hover");
  $("#btn-ch" + hoverChannelNum).addClass("btn-hover");

  //show dot hover
  $(".isometric_dot").removeClass("dot-hover");
  $("#dot" + hoverChannelNum).addClass("dot-hover");

  //draw hover highlight line
  for (var i = 0; i < cAvailableChannelsArray.length; i++) {
    if (cAvailableChannelsArray[i] === hoverChannelNum) {
      var availableChannelsIndex = i;
      break;
    }
  }
  var xCoord = 0;
  var yCoord =
    availableChannelsIndex * (cChannelStrokeWidth + cFillerStrokeWidth) + cChannelStrokeWidth / 2;

  gHoverHighlightGroup.removeChildren();
  var hoverLine = new paper.Path.Line({
    from: [xCoord, yCoord],
    to: [Math.round($(window).width()), yCoord],
    strokeWidth: cChannelStrokeWidth,
    // name: 'ch' + channelCount
  });
  hoverLine.strokeColor = new paper.Color(0.57255, 0.82745, 1.0, 0.6);
  gHoverHighlightGroup.addChild(hoverLine);

  if (parent.gMobileSite !== true && parent.gCurrMissionTime !== undefined) {
    parent.thirtyButtons_hover_fromMOCRviz(hoverChannelNum);
  }

  setControllerDetails(hoverChannelNum, false);
}

function channelButtons_mouseleave() {
  for (var counter = 1; counter <= 60; counter++) {
    var buttonSelector = $("#btn-ch" + counter);
    buttonSelector.removeClass("btn-hover");
    var dotSelector = $("#dot" + counter);
    dotSelector.removeClass("dot-hover");
  }
  gHoverHighlightGroup.removeChildren();

  if (parent.gMobileSite !== true && parent.gCurrMissionTime !== undefined) {
    parent.thirtyButtons_mouseleave_fromMOCRviz();
  }
  setControllerDetails(gActiveChannel);
}

function positionIsometricElements() {
  // $('#isometricImage').on('click', function(e) {
  //     var offset = $(this).offset();
  //     // console.log("X: " + (e.pageX - offset.left).toString() + " - Y: " + (e.pageY - offset.top).toString());
  //     console.log("X: " + (e.pageX - offset.left - 22).toString() + ", Y: " + (e.pageY - offset.top - 22).toString());
  // });

  var isoSelector = $("#isometric");
  var btnSelector = $("#btn-ch57");
  var isometricImageSelector = $("#isometricImage");
  var offset = btnSelector.offset();
  if (parent.gMobileSite !== true) {
    var leftPosition = offset.left + btnSelector.width() + 20;
    //position the background image
    // isoSelector.css({"left": leftPosition + "px"});
    var isoWidth = isometricImageSelector.width();
    var screenRemainderWidth = Math.round($(window).width()) - leftPosition;
    var scalePercentage = (100 * screenRemainderWidth) / isoWidth / 100;

    scalePercentage = scalePercentage > 0.6 ? 0.6 : scalePercentage;
    isoSelector.css("transform", "scale(" + scalePercentage + ")");
  } else {
    //if on mobile site
    isoSelector.css({ top: "305px" });
    isoWidth = isometricImageSelector.width();
    screenRemainderWidth = Math.round($(window).width());
    scalePercentage = (100 * screenRemainderWidth) / isoWidth / 100;
    // scalePercentage = scalePercentage > 0.6 ? 0.6 : scalePercentage;
    isoSelector.css("transform", "scale(" + scalePercentage + ")");

    //move buttons below MOCR ISO
    // var bottom = gChannelbuttonsHeight + isometricImageSelector.outerHeight(true) + 250;
    // $('#channelbuttons').css("top", bottom + "px");
    $("#channelbuttons").css("top", "530px");

    var channelButtonsWidth = offset.left + btnSelector.width() + 20;
    screenRemainderWidth = Math.round($(window).width());
    scalePercentage = (100 * screenRemainderWidth) / channelButtonsWidth / 100;
    $("#channelbuttons").css("transform", "scale(" + scalePercentage + ")");

    $("#controller-details").css("top", "710px");
  }

  //make the image visible after resize
  isometricImageSelector.css("display", "block");

  // transform: scale(0.5);
  // transform-origin: 0 0;

  isoSelector.append(
    "<span id='dot47' class='isometric_dot' style='left:" + 35 + "px;top:" + 245 + "px'>B</span>"
  ); //BOOSTER
  isoSelector.append(
    "<span id='dot48' class='isometric_dot isometric_dot_small' style='left:" +
      50 +
      "px;top:" +
      290 +
      "px'>C</span>"
  ); //BOOSTER C
  isoSelector.append(
    "<span id='dot49' class='isometric_dot isometric_dot_small' style='left:" +
      80 +
      "px;top:" +
      275 +
      "px'>R</span>"
  ); //BOOSTER R
  isoSelector.append(
    "<span id='dot19' class='isometric_dot' style='left:" + 127 + "px;top:" + 195 + "px'>R</span>"
  ); //RETRO
  isoSelector.append(
    "<span id='dot20' class='isometric_dot' style='left:" + 218 + "px;top:" + 151 + "px'>FI</span>"
  ); //FIDO
  isoSelector.append(
    "<span id='dot21' class='isometric_dot' style='left:" + 307 + "px;top:" + 102 + "px'>G</span>"
  ); //GUIDO

  isoSelector.append(
    "<span id='dot12' class='isometric_dot' style='left:" + 196 + "px;top:" + 280 + "px'>S</span>"
  ); //SURGEON
  isoSelector.append(
    "<span id='dot13' class='isometric_dot isometric_dot_small' style='left:" +
      240 +
      "px;top:" +
      305 +
      "px'>R</span>"
  ); //SURGEON R
  isoSelector.append(
    "<span id='dot14' class='isometric_dot' style='left:" + 279 + "px;top:" + 231 + "px'>C</span>"
  ); //CAPCOM
  isoSelector.append(
    "<span id='dot15' class='isometric_dot isometric_dot_small' style='left:" +
      320 +
      "px;top:" +
      260 +
      "px'>R</span>"
  ); //CAPCOM R
  isoSelector.append(
    "<span id='dot17' class='isometric_dot' style='left:" + 366 + "px;top:" + 166 + "px'>PE</span>"
  ); //POS EECOM
  isoSelector.append(
    "<span id='dot18' class='isometric_dot' style='left:" + 416 + "px;top:" + 136 + "px'>CG</span>"
  ); //CSM GNC
  isoSelector.append(
    "<span id='dot58' class='isometric_dot' style='left:" + 469 + "px;top:" + 105 + "px'>T</span>"
  ); //LM EECOM (TELMU)
  isoSelector.append(
    "<span id='dot57' class='isometric_dot' style='left:" + 528 + "px;top:" + 71 + "px'>LG</span>"
  ); //LM GNC

  isoSelector.append(
    "<span id='dot16' class='isometric_dot' style='left:" + 217 + "px;top:" + 366 + "px'>CE</span>"
  ); //CSM EECOM
  isoSelector.append(
    "<span id='dot5' class='isometric_dot' style='left:" + 286 + "px;top:" + 323 + "px'>P</span>"
  ); //PRO
  isoSelector.append(
    "<span id='dot6' class='isometric_dot' style='left:" + 344 + "px;top:" + 291 + "px'>A</span>"
  ); //AFD
  isoSelector.append(
    "<span id='dot50' class='isometric_dot' style='left:" + 454 + "px;top:" + 214 + "px'>FD</span>"
  ); //FLIGHT
  isoSelector.append(
    "<span id='dot7' class='isometric_dot isometric_dot_small' style='left:" +
      470 +
      "px;top:" +
      260 +
      "px'>L</span>"
  ); //FLIGHT L
  isoSelector.append(
    "<span id='dot8' class='isometric_dot isometric_dot_small' style='left:" +
      500 +
      "px;top:" +
      240 +
      "px'>R</span>"
  ); //FLIGHT R
  isoSelector.append(
    "<span id='dot9' class='isometric_dot' style='left:" + 538 + "px;top:" + 161 + "px'>FA</span>"
  ); //FAO
  isoSelector.append(
    "<span id='dot11' class='isometric_dot' style='left:" + 581 + "px;top:" + 130 + "px'>N</span>"
  ); //NETWORK
  isoSelector.append(
    "<span id='dot42' class='isometric_dot isometric_dot_small' style='left:" +
      600 +
      "px;top:" +
      170 +
      "px'>T</span>"
  ); //NETWORK TECH
  isoSelector.append(
    "<span id='dot43' class='isometric_dot isometric_dot_small' style='left:" +
      623 +
      "px;top:" +
      152 +
      "px'>C</span>"
  ); //NETWORK CONTROLLER

  isoSelector.append(
    "<span id='dot61' class='isometric_dot' style='left:" + 456 + "px;top:" + 316 + "px'></span>"
  ); //unused
  isoSelector.append(
    "<span id='dot2' class='isometric_dot' style='left:" + 550 + "px;top:" + 247 + "px'>FO</span>"
  ); //DIR FLIGHT OPS
  isoSelector.append(
    "<span id='dot3' class='isometric_dot' style='left:" + 645 + "px;top:" + 182 + "px'>M</span>"
  ); //MISSION DIRECTOR
  isoSelector.append(
    "<span id='dot53' class='isometric_dot' style='left:" + 686 + "px;top:" + 155 + "px'>I</span>"
  ); //FD R

  //set alt text
  for (var counter = 1; counter < 60; counter++) {
    var altText = cTrackInfo["ch" + counter][0] + ": " + cTrackInfo["ch" + counter][1];
    $("#dot" + counter).attr("title", altText);
  }
}

function isometric_dots_hover() {
  // console.log("isometric_dots_hover hovered: " + $(this).attr('id'));
  var hoverChannelNum = parseInt(
    $(this)
      .attr("id")
      .substr($(this).attr("id").indexOf("dot") + 3)
  );

  //show dot hover
  $(".isometric_dot").removeClass("dot-hover");
  $("#dot" + hoverChannelNum).addClass("dot-hover");

  //show hover on buttons
  $(".btn-channel").removeClass("btn-hover");
  $("#btn-ch" + hoverChannelNum).addClass("btn-hover");

  //show controller info
  setControllerDetails(hoverChannelNum, false);

  //draw hover highlight line
  for (var i = 0; i < cAvailableChannelsArray.length; i++) {
    if (cAvailableChannelsArray[i] === hoverChannelNum) {
      var availableChannelsIndex = i;
      break;
    }
  }
  var xCoord = 0;
  var yCoord =
    availableChannelsIndex * (cChannelStrokeWidth + cFillerStrokeWidth) + cChannelStrokeWidth / 2;

  gHoverHighlightGroup.removeChildren();
  var hoverLine = new paper.Path.Line({
    from: [xCoord, yCoord],
    to: [Math.round($(window).width()), yCoord],
    strokeWidth: cChannelStrokeWidth,
    // name: 'ch' + channelCount
  });
  hoverLine.strokeColor = new paper.Color(0.57255, 0.82745, 1.0, 0.6);
  gHoverHighlightGroup.addChild(hoverLine);

  if (parent.gMobileSite !== true && parent.gCurrMissionTime !== undefined) {
    parent.thirtyButtons_hover_fromMOCRviz(hoverChannelNum);
  }
}

function isometric_dots_click() {
  gActiveChannel = parseInt(
    $(this)
      .attr("id")
      .substr($(this).attr("id").indexOf("dot") + 3)
  ); //get channel number from dot label
  ga("send", "event", "MOCRviz", "click", "isobuttons");
  loadChannelSoundfile();
  playFromCurrGET(true);
  refreshTapeActivityDisplay(true);
  gWaveformRefresh = true;
  setControllerDetails(gActiveChannel);
}

function isometric_dots_mouseleave() {
  for (var counter = 1; counter <= 60; counter++) {
    var dotSelector = $("#dot" + counter);
    dotSelector.removeClass("dot-hover");
    var buttonSelector = $("#btn-ch" + counter);
    buttonSelector.removeClass("btn-hover");
  }
  gHoverHighlightGroup.removeChildren();

  if (parent.gMobileSite !== true && parent.gCurrMissionTime !== undefined) {
    parent.thirtyButtons_mouseleave_fromMOCRviz();
  }
  setControllerDetails(gActiveChannel);
}

function setControllerDetails(channelNum, setRight = true) {
  $("#controller-name").text(cTrackInfo["ch" + channelNum][0]);
  $("#controller-description").text(cTrackInfo["ch" + channelNum][1]);
  if (setRight) {
    $("#rightTitleText").text(cTrackInfo["ch" + channelNum][0]);
  }
}

function getTapeByGETseconds(seconds, channel) {
  var intChannel = parseInt(channel);
  var rec = [];

  var tapeRanges = intChannel <= 30 ? gTapeRangesHR1 : gTapeRangesHR2;
  for (var index = 0; index < tapeRanges.length; ++index) {
    var startSeconds = timeStrToSeconds(tapeRanges[index][2]);
    var endSeconds = timeStrToSeconds(tapeRanges[index][3]);
    if (seconds >= startSeconds && seconds <= endSeconds) {
      rec = tapeRanges[index];
      break;
    }
  }
  if (rec.length === 0) {
    trace(
      "getTapeByGETseconds returing EMPTY rec for seconds: " + seconds + " channel: " + channel
    );
  }
  // trace('getTapeByGETseconds: seconds:' + seconds + ' channel: ' + channel + ' tape: ' + rec[0]);
  return rec;
}

function closeMOCRviz() {
  parent.activateAppTab("photoTab");
  parent.closeMOCRviz();
}

// Play video function
function playAudio() {
  if (gPlayer.paused && !gOnplaying) {
    gPlayer.play();
  }
}

// Pause video function
function pauseAudio() {
  if (!gPlayer.paused && !gOnpause) {
    gPlayer.pause();
  }
}

//------------ data import
function ajaxGetTapeRangeData() {
  var urlStr = cWebCdnRoot + "./data/tape_ranges.csv";
  return $.ajax({
    type: "GET",
    url: urlStr,
    dataType: "text",
    async: false,
    success: function (data) {
      processTapeRangeData(data);
    },
  });
}

function processTapeRangeData(allText) {
  //trace("processTapeRangeData");
  var allTextLines = allText.split(/\r\n|\n/);
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split("|");
    var rec = [];
    rec.push(data[0]);
    rec.push(data[1]);
    rec.push(data[2]);
    rec.push(data[3]);
    // trace(timeStrToSeconds(data[2]));
    if (data[1].includes("HR1")) {
      gTapeRangesHR1.push(rec);
    } else {
      gTapeRangesHR2.push(rec);
    }
  }
  gTapeRangesHR1 = gTapeRangesHR1.sort(Comparator);
  gTapeRangesHR2 = gTapeRangesHR2.sort(Comparator);
}

function getTapeActivityRanges(activeSec) {
  // trace("getTapeActivityRanges: " + activeSec);
  activeSec = activeSec + cCountdownSeconds;

  var nearestStart = Math.floor(activeSec / 1000) * 1000;
  if (nearestStart > 0) {
    var startRange = nearestStart - 1000;
  } else {
    startRange = 0;
  }
  var tapesActivity1filename =
    "tape_activity_" + startRange.toString() + "-" + (nearestStart - 1).toString() + ".json";
  var tapesActivity2filename =
    "tape_activity_" + nearestStart.toString() + "-" + (nearestStart + 999).toString() + ".json";

  var nearestEnd = Math.ceil(activeSec / 1000) * 1000;
  if (nearestEnd + 1000 > 645438) {
    //if greater than total length of tape activity data
    var endRange = 645438;
  } else {
    endRange = nearestEnd + 1000;
  }
  if (nearestStart > nearestEnd) {
    trace("!!!!!!!!!!! getTapeActivityRanges bug");
  }
  var tapesActivity3filename =
    "tape_activity_" + nearestEnd.toString() + "-" + (endRange - 1).toString() + ".json";

  gTapesActivityStartIndex = startRange;

  var tapesActivityFilenames = [];
  tapesActivityFilenames.push(tapesActivity1filename);
  tapesActivityFilenames.push(tapesActivity2filename);
  tapesActivityFilenames.push(tapesActivity3filename);

  return tapesActivityFilenames;
}

function ajaxGetTapesActivityDataRange(tapesActivityFilenames) {
  gActiveTapesActivityFilenames = tapesActivityFilenames;

  var tapeActivityDataPath = cTapeCdnRoot + "/tape_activity/";

  var tapeActivity1;
  var tapeActivity2;
  var tapeActivity3;

  if (!gGettingTapeActivity) {
    trace("ajaxGetTapesActivityDataRange()MOCRviz: " + tapesActivityFilenames.toString());
    gGettingTapeActivity = true;
    gTapesActivityRangeArray = [];
    $.when(
      $.getJSON(tapeActivityDataPath + tapesActivityFilenames[0], function (data) {
        trace("getting tape activity: " + tapeActivityDataPath + tapesActivityFilenames[0]);
        tapeActivity1 = data;
      }),
      $.getJSON(tapeActivityDataPath + tapesActivityFilenames[1], function (data) {
        trace("getting tape activity: " + tapeActivityDataPath + tapesActivityFilenames[1]);
        tapeActivity2 = data;
      }),
      $.getJSON(tapeActivityDataPath + tapesActivityFilenames[2], function (data) {
        trace("getting tape activity: " + tapeActivityDataPath + tapesActivityFilenames[2]);
        tapeActivity3 = data;
      })
    ).then(function () {
      gGettingTapeActivity = false;
      gTapesActivityRangeArray = [];
      gTapesActivityRangeArray = gTapesActivityRangeArray.concat(tapeActivity1);
      gTapesActivityRangeArray = gTapesActivityRangeArray.concat(tapeActivity2);
      gTapesActivityRangeArray = gTapesActivityRangeArray.concat(tapeActivity3);

      drawChannels(true);
      drawTimeCursor();
    });
  }
}

function ajaxGetWaveData(url) {
  var xhr = new XMLHttpRequest();

  gWavDataLoaded = false;
  // .dat file generated by audiowaveform program
  xhr.responseType = "arraybuffer";
  xhr.open("GET", url);

  xhr.addEventListener("load", function (progressEvent) {
    gWaveform512 = WaveformData.create(progressEvent.target);
    // gWaveform4096 = gWaveform.resample({scale: 4096});
    // gWaveform2048 = gWaveform.resample({scale: 2048});
    // gWaveform1024 = gWaveform.resample({scale: 1024});
    // gWaveform512 = gWaveform.resample({scale: 512});

    trace("APPREADY: gWaveform Ajax loaded");
    // trace(gWaveform512.duration);
    gWavDataLoaded = true;
    gWaveformRefresh = true;
    // wavDataLoaded();
  });
  xhr.send();
}

// ------------------------------- transcript functions --------------------------------

function ajaxGetTranscript() {
  var urlStr = `${cTapeCdnRoot}/transcripts/CH${gActiveChannel}_transcript.txt`;
  return $.ajax({
    type: "GET",
    url: urlStr,
    dataType: "text",
    success: function (data) {
      processTranscript(data);
    },
  });
}

function processTranscript(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var curRow = 0;
  for (var i = 0; i < allTextLines.length; i++) {
    if (allTextLines[i] === "") continue;
    var data = allTextLines[i].split("|");

    var rec = [];
    rec.push(data[0]);
    rec.push(data[1]);

    gTranscriptDataLookup[data[0]] = curRow;
    gTranscriptIndex[i] = data[0];

    gTranscriptData.push(rec);
    curRow++;
  }
  scrollTranscriptToTimeId(findClosestTranscriptItem(gCurrGETSeconds));
}

function resetAndLoadTranscript() {
  gTranscriptData = [];
  gTranscriptDataLookup = {};
  gTranscriptIndex = [];
  gTranscriptDataLoaded = false;
  ajaxGetTranscript();
}

function transcriptClick(timeId) {
  gCurrGETSeconds = timeStrToSeconds(timeIdToTimeStr(timeId));
  if (parent.gCurrMissionTime !== "" && parent.gCurrMissionTime !== undefined) {
    parent.seekToTime(secondsToTimeId(gCurrGETSeconds));
  }
  playFromCurrGET(true);

  // scroll the transcript
  var timeId = timeStrToTimeId(secondsToTimeStr(gCurrGETSeconds));
  scrollTranscriptToTimeId(timeId);

  refreshTapeActivityDisplay(true);
  gWaveformRefresh = true;
  setControllerDetails(gActiveChannel);
}

function repopulateTranscript(timeId) {
  var transcriptIndex = gTranscriptDataLookup[timeId]; //must be a timeId that exists in the transcripts
  var transcriptTable = $("#transcriptTable");
  transcriptTable.html("");
  var startIndex = transcriptIndex - 50;
  var endIndex = startIndex + 100;
  startIndex = startIndex < 0 ? 0 : startIndex;
  endIndex = endIndex >= gTranscriptIndex.length ? gTranscriptIndex.length - 1 : endIndex;
  for (var i = startIndex; i < endIndex; i++) {
    transcriptTable.append(getTranscriptObjectHTML(i));
  }
  gTranscriptDisplayStartIndex = startIndex;
  gTranscriptDisplayEndIndex = endIndex;
  trace(
    "repopulateTranscript(): populated transcript from: " +
      gTranscriptDisplayStartIndex +
      " to " +
      gTranscriptDisplayEndIndex
  );
  $("#transcriptDiv").scrollTop("#transid" + timeId);
}

function prependTranscript(count, atTop) {
  atTop = atTop || false;
  var transcriptDiv = $("#transcriptDiv");
  var transcriptTable = $("#transcriptTable");
  var htmlToPrepend = "";
  var prependedCount = 0;
  var startIndex = gTranscriptDisplayStartIndex - count;
  for (var i = startIndex; i < startIndex + count; i++) {
    if (i >= 0) {
      htmlToPrepend = htmlToPrepend + getTranscriptObjectHTML(i);
      prependedCount++;
    }
  }
  transcriptTable.prepend(htmlToPrepend);

  if (atTop) {
    var elementToScrollBackTo = $(
      "#transid" + timeStrToTimeId(gTranscriptData[gTranscriptDisplayStartIndex][0])
    );
    //trace("element to scroll back to: " + elementToScrollBackTo.attr('id'));
    var oldScrollDestination =
      transcriptDiv.scrollTop() + elementToScrollBackTo.offset().top - transcriptDiv.offset().top;
    transcriptDiv.scrollTop(oldScrollDestination);
  }

  trace("prependTranscript(): prepended transcript items from: " + startIndex);
  gTranscriptDisplayStartIndex = gTranscriptDisplayStartIndex - prependedCount;
  trace("prependTranscript(): prepended transcript items to: " + i);
  var diff = i - startIndex;
  trace("prependTranscript(): difference: " + diff);
  trace("prependTranscript(): counted prepends in if statement: " + prependedCount);
}

function appendTranscript(count, atBottom) {
  atBottom = atBottom || false;
  var transcriptDiv = $("#transcriptDiv");
  var transcriptTable = $("#transcriptTable");
  var htmlToAppend = "";
  var startIndex = gTranscriptDisplayEndIndex + 1;
  var appendedCount = 0;
  for (var i = startIndex; i < startIndex + count; i++) {
    if (i >= 0 && i < gTranscriptData.length) {
      //trace("Appended: " + gTranscriptData[i][0]);
      htmlToAppend = htmlToAppend + getTranscriptObjectHTML(i);
      appendedCount++;
    }
  }
  if (atBottom) var topToScrollBackTo = transcriptDiv.scrollTop();

  transcriptTable.append(htmlToAppend);

  if (atBottom) transcriptDiv.scrollTop(topToScrollBackTo);

  trace("appendTranscript(): appended transcript items from: " + startIndex);
  gTranscriptDisplayEndIndex = gTranscriptDisplayEndIndex + appendedCount;
  trace("appendTranscript(): appended transcript items to: " + i);
  var diff = i - startIndex;
  trace("appendTranscript(): difference: " + diff);
  trace("appendTranscript(): counted appends in if statement: " + appendedCount);
}

function trimTranscript() {
  var numberToRemove = gTranscriptDisplayEndIndex - gTranscriptDisplayStartIndex - 150;
  if (numberToRemove > 0) {
    trace("trimTranscript():" + numberToRemove);
    var currDistFromStart = gCurrentHighlightedTranscriptIndex - gTranscriptDisplayStartIndex;
    var currDistFromEnd = gTranscriptDisplayEndIndex - gCurrentHighlightedTranscriptIndex;
    trace("trimTranscript(): currDistFromStart: " + currDistFromStart);
    trace("trimTranscript(): currDistFromEnd: " + currDistFromEnd);
    if (currDistFromStart > currDistFromEnd) {
      //trim items from top of transcript div
      var counter = 0;
      for (
        var i = gTranscriptDisplayStartIndex;
        i < gTranscriptDisplayStartIndex + numberToRemove;
        i++
      ) {
        $("#transid" + gTranscriptIndex[i]).remove();
        counter++;
      }
      //trace("Trimming " + numberToRemove + " transcript items from top");
      var tempEndForTrace = gTranscriptDisplayStartIndex + numberToRemove;
      trace(
        "trimTranscript(): removed from top: " +
          counter +
          " starting at index: " +
          gTranscriptDisplayStartIndex +
          " up to index: " +
          tempEndForTrace
      );
      gTranscriptDisplayStartIndex = gTranscriptDisplayStartIndex + numberToRemove;
    } else {
      //trim items from bottom of transcript items div
      counter = 0;
      for (i = gTranscriptDisplayEndIndex - numberToRemove; i <= gTranscriptDisplayEndIndex; i++) {
        $("#transid" + gTranscriptIndex[i]).remove();
        counter++;
      }
      //trace("Trimming " + numberToRemove + " transcript items from bottom");
      gTranscriptDisplayEndIndex = gTranscriptDisplayEndIndex - numberToRemove;
      trace(
        "trimTranscript(): removed from bottom: " +
          counter +
          " starting at index: " +
          gTranscriptDisplayEndIndex -
          numberToRemove
      );
    }
    var transcriptDiv = $("#transcriptDiv");
    var currElement = $(
      "#transid" + timeStrToTimeId(gTranscriptData[gCurrentHighlightedTranscriptIndex][0])
    );
    var newScrollDestination =
      transcriptDiv.scrollTop() + currElement.offset().top - transcriptDiv.offset().top;
    transcriptDiv.scrollTop(newScrollDestination);
  }
}

function getTranscriptObjectHTML(transcriptIndex, style) {
  style = style || "";
  //trace("getTranscriptObjectHTML():" + utteranceIndex);
  var transcriptObject = gTranscriptData[transcriptIndex];

  var html = $("#transcriptTemplate").html();
  html = html.replace("@style", style);
  var timeId = transcriptObject[0];
  html = html.replace(/@transid/g, timeId);
  html = html.replace("@timestamp", timeIdToTimeStr(transcriptObject[0]));
  html = html.replace("@words", transcriptObject[1]);
  return html;
}

function scrollTranscriptToTimeId(timeId) {
  //if (gTranscriptDataLookup[timeId] !== undefined) {
  if (gTranscriptDataLookup.hasOwnProperty(timeId)) {
    //if ($.inArray(timeId, gTranscriptIndex) != -1) {
    //trace("scrollTranscriptToTimeId " + timeId);
    var transcriptDiv = $("#transcriptDiv");
    var transcriptTable = $("#transcriptTable");

    gCurrentHighlightedTranscriptIndex = gTranscriptDataLookup[timeId];

    //check if transcriptDiv is empty
    if (typeof gTranscriptDisplayStartIndex === "undefined") {
      repopulateTranscript(timeId);
      //check if timeId is already loaded into transcript div
    } else if (gTranscriptDataLookup[timeId] < gTranscriptDisplayStartIndex + 49) {
      //prepend - always have 50 lines above current time
      var prependCount = gTranscriptDisplayStartIndex - gTranscriptDataLookup[timeId] + 50;
      if (prependCount > 50) {
        repopulateTranscript(timeId);
      } else {
        prependCount = 50;
        prependTranscript(prependCount);
      }
    } else if (gTranscriptDataLookup[timeId] > gTranscriptDisplayEndIndex - 49) {
      //append - always have 50 lines below current time
      var appendCount = gTranscriptDataLookup[timeId] - gTranscriptDisplayEndIndex + 50;
      if (appendCount > 50) {
        repopulateTranscript(timeId);
      } else {
        appendCount = 50;
        appendTranscript(appendCount);
      }
    }
    trimTranscript();

    transcriptTable.children("*").css("background-color", ""); //clear all element highlights
    var highlightedTranscriptElement = $(".transid" + timeId);
    highlightedTranscriptElement.css("background-color", cBackground_color_active); //set new element highlights

    const scrollTopMarginTop = 50;
    if (highlightedTranscriptElement !== undefined) {
      var newScrollDestination =
        transcriptDiv.scrollTop() +
        (highlightedTranscriptElement.offset().top - scrollTopMarginTop) -
        transcriptDiv.offset().top;

      transcriptDiv.animate({ scrollTop: newScrollDestination }, 250, "swing", function () {
        trace("Finished animating: " + newScrollDestination);
      });
    }

    gLastTranscriptTimeId = timeId;
  }
}

function findClosestTranscriptItem(secondsSearch) {
  trace("findClosestTranscriptItem():" + secondsSearch);
  var timeId = secondsToTimeId(secondsSearch);
  var scrollTimeId = gTranscriptIndex[gTranscriptIndex.length - 1];
  for (var i = 1; i < gTranscriptIndex.length; ++i) {
    if (timeId < parseInt(gTranscriptIndex[i])) {
      scrollTimeId = gTranscriptIndex[i - 1];
      break;
    }
  }
  trace(
    "findClosestTranscriptItem(): searched Transcript array, found closest: timeid " +
      timeId +
      " after " +
      i +
      " searches"
  );
  return scrollTimeId;
}

function performSearch() {
  //trace("performSearch(): start");
  var searchResultsTable = $("#searchResultsTable");
  var searchResultCount = 0;
  var searchText = $("#searchInputField").val().toLowerCase();
  searchResultsTable.html("");
  if (searchText.length > 1) {
    for (var counter = 0; counter < gTranscriptData.length; counter++) {
      if (gTranscriptData[counter][1].toLowerCase().indexOf(searchText) !== -1) {
        var html = getSearchResultHTML(counter);
        var searchResultTextIndex = html.toLowerCase().indexOf(searchText);
        html =
          html.slice(0, searchResultTextIndex) +
          "<span class='searchResultHighlight'>" +
          html.slice(searchResultTextIndex, searchResultTextIndex + searchText.length) +
          "</span>" +
          html.slice(searchResultTextIndex + searchText.length);
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
  var searchObject = gTranscriptData[searchArrayIndex];
  var html = $("#searchResultTemplate").html();
  var timeId = searchObject[0];

  html = html.replace(/@searchResultTimeid/g, timeId);
  html = html.replace("@timestamp", timeIdToTimeStr(searchObject[0]));
  html = html.replace("@words", searchObject[1]);
  return html;
}

function searchResultClick(timeId) {
  transcriptClick(timeId);

  // switch back to transcript tab
  $("#textBtn").addClass("selected");
  $("#searchBtn").removeClass("selected");
  $("#aboutBtn").removeClass("selected");
  $("#transcriptDiv").css("display", "block");
  $("#searchDiv").css("display", "none");
  $("#aboutDiv").css("display", "none");
}

//------------ helpers

function secondsToTimeStr(totalSeconds) {
  var hours = Math.abs(parseInt(totalSeconds / 3600));
  var minutes = (Math.abs(parseInt(totalSeconds / 60)) % 60) % 60;
  var seconds = Math.abs(parseInt(totalSeconds)) % 60;
  seconds = Math.floor(seconds);
  var timeStr = padZeros(hours, 3) + ":" + padZeros(minutes, 2) + ":" + padZeros(seconds, 2);
  if (totalSeconds < 0) {
    timeStr = "-" + timeStr.substr(1); //change timeStr to negative, replacing leading zero in hours with "-"
  }
  return timeStr;
}

function secondsToTimeId(seconds) {
  var timeId = secondsToTimeStr(seconds).split(":").join("");
  return timeId;
}

function timeStrToSeconds(timeStr) {
  var sign = timeStr.substr(0, 1);
  var hours = parseInt(timeStr.substr(0, 3));
  var minutes = parseInt(timeStr.substr(4, 2));
  var seconds = parseInt(timeStr.substr(7, 2));
  var signToggle = sign === "-" ? -1 : 1;
  var totalSeconds = Math.round(signToggle * (Math.abs(hours) * 60 * 60 + minutes * 60 + seconds));
  //if (totalSeconds > 230400)
  //    totalSeconds -= 9600;
  return totalSeconds;
}

function timeStrToTimeId(timeStr) {
  return timeStr.split(":").join("");
}

function timeIdToTimeStr(timeId) {
  return timeId.substr(0, 3) + ":" + timeId.substr(3, 2) + ":" + timeId.substr(5, 2);
}

function padZeros(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function Comparator(a, b) {
  if (timeStrToSeconds(a[2]) < timeStrToSeconds(b[2])) return -1;
  if (timeStrToSeconds(a[2]) > timeStrToSeconds(b[2])) return 1;
  return 0;
}

function AddPoint5IfOdd(number) {
  if (number % 2 === 1) {
    return number + 0.5;
  } else {
    return number;
  }
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

function interpolateHeight(total_height, size) {
  var amplitude = 256;
  return total_height - ((size + 128) * total_height) / amplitude;
}
