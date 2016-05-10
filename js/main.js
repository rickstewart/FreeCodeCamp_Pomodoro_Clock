/**
 * Created by Rick Stewart on 11/20/2015.
 */

/* 'exported' statement tells JsHint to ignore 'function never used' warning as they are called externally */
/* exported plusWorkTime */
/* exported minusWorkTime */
/* exported plusBreakTime */
/* exported minusBreakTime */
/* exported playAlarm */
/* exported start */
/* exported stop */
/* exported reset */
/* exported popOpenInfoWindow */

'use strict';                                      // tells browsers to use strict - a best practice

var workLength = 25;                               // default of 25 minutes for a pomodoro
var breakLength = 5;                               // default of 5 minutes for a break
var $hands = $('#liveclock').find('div.hand');     // get reference
var freezeHands = false;                           // if true pomodoro hands (work, break ) stop advancing
var workAsDegree = 0;
var breakAsDegree = 0;
var frozenWorkAsDegree = 0;
var frozenBreakAsDegree = 0;
var targetDisplayWorkLength = document.getElementById('display_work_timer');   // store HTML page location work length
var targetDisplayBreakLength = document.getElementById('display_play_timer');  // store HTML page location break length
var alarmNotTriggeredFlag =  true;                    // 'true' if alarm was not yet triggered
var timerRunning = false;                             // 'true' when timer running a pomodoro
var infoWindow;

targetDisplayWorkLength.innerHTML = workLength;    // set initial work length
targetDisplayBreakLength.innerHTML = breakLength;  // set initial break length

var plusWorkTime = function() {                          // increment work time value
    if(workLength <= 58) {
        workLength += 1;
        targetDisplayWorkLength.innerHTML = workLength;
    }
};

var minusWorkTime = function() {                         // decrement work length value
    if(workLength >= 2) {
        workLength -= 1;
        targetDisplayWorkLength.innerHTML = workLength;
    }
};

var plusBreakTime = function() {                          // increment break time value
    if(breakLength <= 58) {
        breakLength += 1;
        targetDisplayBreakLength.innerHTML = breakLength;
    }
};

var minusBreakTime = function() {                        // decrement break length value
    if(breakLength >= 2) {
        breakLength -= 1;
        targetDisplayBreakLength.innerHTML = breakLength;
    }
};

var playAlarm = function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', './audio/tinsha.mp3');
    audioElement.play();
};

/***********************************************
 * FreeCodeCamp Pomodoro Clock based on:
 *
 * CSS3 Analog Clock- by JavaScript Kit (www.javascriptkit.com)
 * http://www.javascriptkit.com/script/script2/css3analogclock.shtml
 ***********************************************/

var setFreezeHands = function(bool) {
    freezeHands = bool;
};

var setRunning = function(bool) {
    timerRunning = bool;
};

var setAlarmTriggered = function(bool) {
    alarmNotTriggeredFlag = bool;
};

var setTimeAtStart = function() {                  // record start time for pomodoro
    var currentDate = new Date();
    frozenWorkAsDegree = (workLength / 60 * 360) + (currentDate.getMinutes() / 60 * 360);
    frozenBreakAsDegree = frozenWorkAsDegree + (breakLength / 60 * 360);
};

/*  Control Panel buttons  */
var start = function() {
    setTimeAtStart();
    setRunning(true);
    setFreezeHands(true);

};

var stop = function() {
    setFreezeHands(false);
    setRunning(false);
};

var reset = function() {
    workLength = 25;                               // reset to default values
    breakLength = 5;
    targetDisplayWorkLength.innerHTML = workLength;    // set  work length
    targetDisplayBreakLength.innerHTML = breakLength;  // set break length
    setFreezeHands(false);
    setRunning(false);
};

var popOpenInfoWindow = function() {               // opens information window
    var leftValue = (screen.width/2)-(300/2);      // centers window on viewport
    var topValue = (screen.height/2)-(400/2);
    infoWindow = window.open('','infoWindow','height=400px,width=300px,left='+leftValue+',top='+topValue+',menubar=no,resizable=no,status=yes,titlebar=no,location=no');
    infoWindow.document.write('<html><head><title>Helpful Information</title>');
    infoWindow.document.write('<link rel="stylesheet" href="./css/popupStyle.css">');
    infoWindow.document.write('</head><body>');
    infoWindow.document.write('<h2>User Guide</h2>');
    infoWindow.document.write('<p><a href="https://en.wikipedia.org/wiki/Pomodoro_Technique" target="_blank">Wiki article describing Pomodoro</a></p>');
    infoWindow.document.write('<h4>\"Play\"</h4>');
    infoWindow.document.write('<p>Starts a countdown equal to the number of minutes set by the Work Duration. A chime will sound when this countdown completes.</p>');
    infoWindow.document.write('<p>When a Work Period ends a second countdown begins, this time equal to the set Break Time. Again a chime will sound when this countdown completes.</p>');
    infoWindow.document.write('<p>This cycle repeats indefinitely until either the Stop or Reset button is pushed.</p>');
    infoWindow.document.write('<p>The short orange hand on the clock face indicates Work Time remaining. When the minute hand reaches the orange hand, work time is up.</p>');
    infoWindow.document.write('<p>In the same fashion the short blue colored hand indicates Break Time remaining.</p>');
    infoWindow.document.write('<h4>Stop</h4>');
    infoWindow.document.write('<p>Pushing Stop ends the countdown, and leaves Work Duration and Break Duration unchanged.</p>');
    infoWindow.document.write('<h4>Reset</h4>');
    infoWindow.document.write('<p>Pushing Reset ends the countdown, and returns Work Duration and Break Duration to default values.</p>');
    infoWindow.document.write('<br/>');
    infoWindow.document.write('<p><a href="javascript:self.close()">Close</a> this popup.</p>');
    infoWindow.document.write('<br/>');
    infoWindow.document.write('</body></html>');
    infoWindow.document.close();
};

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (f) {
        setTimeout(f, 60);
    };

var updateClock = function () {
    var theDate = new Date();
    var hourAsDegree = ( theDate.getHours() + theDate.getMinutes() / 60 ) / 12 * 360;
    var minuteAsDegree = theDate.getMinutes() / 60 * 360;
    var secondAsDegree = ( theDate.getSeconds() + theDate.getMilliseconds() / 1000 ) / 60 * 360;
    $hands.filter('.hour').css({transform: 'rotate(' + hourAsDegree + 'deg)'});
    $hands.filter('.minute').css({transform: 'rotate(' + minuteAsDegree + 'deg)'});
    $hands.filter('.second').css({transform: 'rotate(' + secondAsDegree + 'deg)'});
    if (freezeHands) {
        /** if freezeHands == true, hands 'work' and 'break' do not advance **/
        $hands.filter('.work').css({transform: 'rotate(' + frozenWorkAsDegree + 'deg)'});
        /** pomodoro work hand **/
        $hands.filter('.break').css({transform: 'rotate(' + frozenBreakAsDegree + 'deg)'});
        /** pomodoro break hand **/
    }
    else {
        workAsDegree = minuteAsDegree + (workLength / 60 * 360);
        breakAsDegree = workAsDegree + (breakLength / 60 * 360);
        $hands.filter('.work').css({transform: 'rotate(' + workAsDegree + 'deg)'});
        $hands.filter('.break').css({transform: 'rotate(' + breakAsDegree + 'deg)'});
    }
    if(((frozenWorkAsDegree % 360) === (minuteAsDegree % 360)) && alarmNotTriggeredFlag && timerRunning) {  // work time expired?
         playAlarm();
         setAlarmTriggered(false);
    }
    if(((frozenBreakAsDegree % 360) === (minuteAsDegree % 360)) && !alarmNotTriggeredFlag && timerRunning) {  // break time expired?
        playAlarm();
        setAlarmTriggered(true);
        setFreezeHands(false);
        start();
    }
    requestAnimationFrame(updateClock);
};

$(window).load (function () {                      // start animation running
    requestAnimationFrame(updateClock);
});
