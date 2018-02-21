// Project: Time data in documents
// Subject: Internet Applications
// Author: Nikola Valesova, xvales02

// style attributes for canvas content
var timelineColour = "#FF0000";
var canvasFont = "17px Times New Roman";

// timeline and canvas size parameters
var timelineHeight = 0;
var canvasWidth = 1000;
var timestampDiff = 60;

// timer for relative dates refresh
var timer = null;


// add control elements and timeline to page
function main() {
    var controlsElement = document.getElementsByClassName('controls');
    if (controlsElement.length != 0)
        controlsElement[0].innerHTML = createControls();
    changeTimestamps();
}


// create radio buttons for timestamp format change
function createControls() {
    var radioButtons = '<h4>Timestamps format</h4>';
    radioButtons += '<label class="container">Absolute<input type="radio" name="timeformat" ';
    radioButtons += 'id="absolute_time" value="absolute" onclick="changeTimestamps()" checked="checked">';
    radioButtons += '<span class="checkmark"></span></label>';
    radioButtons += '<label class="container">Relative<input type="radio" name="timeformat" ';
    radioButtons += 'id="relative_time" value="relative" onclick="changeTimestamps()">';
    radioButtons += '<span class="checkmark"></span></label>';
    radioButtons += createTimeline();
    return radioButtons;
}


// create canvas element for timeline drawing
function createTimeline() {
    var timeStamps = getAllTimeStamps();
    if (timeStamps.length != 0)
        timelineHeight = (timeStamps.length - 1) * timestampDiff;

    var timeline = "<h3>Timeline</h3>";
    var canvasElement = "<canvas id=\"timelineCanvas\" width=\"" + canvasWidth + "\" height=\"";
    canvasElement += timelineHeight + 2 * 15;
    canvasElement += "\">Your browser does not support the HTML5 canvas tag.</canvas>";

    return timeline + canvasElement;
}


// draw a line on canvas
function drawTimeline() {
    var c = document.getElementById("timelineCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = timelineColour;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 15);
    ctx.lineTo(canvasWidth / 2, timelineHeight + 15);
    ctx.stroke();
}


// add circles and descriptions to timeline
function addPoints(showDates) {
    var c = document.getElementById("timelineCanvas");
    var ctx = c.getContext("2d");
    var timeStamps = getAllTimeStamps();
    var timeDiffs = getTimeDiffs(timeStamps);

    ctx.beginPath();
    ctx.fillStyle = timelineColour;
    ctx.font = canvasFont;
    var oneStep = timeDiffs[timeDiffs.length - 1] != 0 ? timeDiffs[timeDiffs.length - 1] / timelineHeight : 0;

    if (timeStamps.length == 1) {
        ctx.arc(canvasWidth / 2, 15, 7, 0, 2*Math.PI);
        ctx.textAlign = "end";
        ctx.fillText(showDates[0], canvasWidth / 2 - 20, 20);        
        ctx.textAlign = "start";
        ctx.fillText(timeStamps[0][1], canvasWidth / 2 + 20, 20);
    }

    ctx.textAlign = "end";
    for (var i = 0; i <= timelineHeight; i += 20) {
        var correspondingEvents = getCorrespondingEvents(timeStamps, timeDiffs, oneStep, i);
        if (correspondingEvents.length > 0)
            ctx.arc(canvasWidth / 2, i + 15, 7, 0, 2*Math.PI);
        if (correspondingEvents.length == 1)
            ctx.fillText(showDates[correspondingEvents[0]], canvasWidth / 2 - 20, i + 20);
        if (correspondingEvents.length > 1)
            ctx.fillText(showDates[correspondingEvents[0]] + " - " + showDates[correspondingEvents[correspondingEvents.length - 1]], canvasWidth / 2 - 20, i + 20);
    }

    ctx.textAlign = "start";
    for (var i = 0; i <= timelineHeight; i += 20) {
        var correspondingEvents = getCorrespondingEvents(timeStamps, timeDiffs, oneStep, i);
        if (correspondingEvents.length == 1)
            ctx.fillText(timeStamps[correspondingEvents[0]][1], canvasWidth / 2 + 20, i + 20);
        if (correspondingEvents.length > 1)
            ctx.fillText(timeStamps[correspondingEvents[0]][1] + " and " + (correspondingEvents.length - 1) + " other events", canvasWidth / 2 + 20, i + 20);    
    }
    ctx.fill();
}


// get set of events that belong to the same point on timeline
function getCorrespondingEvents(timeStamps, timeDiffs, oneStep, offset) {
    var correspondingEvents = [];
    for (var i = 0; i < timeStamps.length; i++) {
        if (timeDiffs[i] >= offset * oneStep && timeDiffs[i] < (offset + 20) * oneStep)
            correspondingEvents.push(i);
    }
    return correspondingEvents;
}


// get a set of timestamps and their descriptions 
function getAllTimeStamps() {
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;
    var timeStamps = [];

    for (var i = 0; i < timeElementCount; i++)
        timeStamps.push([new Date(timeElements[i].dateTime), timeElements[i].title]);

    return timeStamps.sort(function(a, b) {
        return new Date(b[0]) - new Date(a[0]);
      }).reverse();
}


// compute time differentials among the first and all events
function getTimeDiffs(timeStamps) {
    var timeDiffs = [];
    for (var i = 0; i < timeStamps.length; i++)
        timeDiffs.push((timeStamps[i][0] - timeStamps[0][0]) / 100000);
    return timeDiffs;
}


// change the format of displayed timestamps 
function changeTimestamps() {
    drawTimeline();
    if (document.getElementById("absolute_time").checked) {
        if (timer != null) {
            clearInterval(timer);
            timer = null;
        }
        addPoints(absoluteDates());
    }
    else {
        if (timer == null)
            timer = setInterval(function(){changeTimestamps();}, 60000);
        addPoints(relativeDates());        
    }
}


// get all dates and transform them to the absolute format
function absoluteDates() {
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;
    var absoluteDates = []
    var absTimes = []
    var options = {
        year: "numeric", month: "short", // weekday: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit"  
    };

    for (var i = 0; i < timeElementCount; i++)
        absTimes.push(new Date(timeElements[i].dateTime));

    absTimes = absTimes.sort(function(a, b) {
        return new Date(b) - new Date(a);
    }).reverse();

    for (var i = 0; i < timeElementCount; i++)
        absoluteDates.push(absTimes[i].toLocaleDateString("en-US", options));

    return absoluteDates;
}


// get all dates and transform them to the relative format
function relativeDates() {
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;
    var relativeDates = []
    var diffTimes = [];

    for (var i = 0; i < timeElementCount; i++)
        diffTimes.push(new Date() - new Date(timeElements[i].dateTime));

    diffTimes = diffTimes.sort(function(a, b) {
        return new Date(b) - new Date(a);
    });

    for (var i = 0; i < diffTimes.length; i++) {
        var timeDiffs = computeDifferentials(diffTimes[i]);

        for (var j = timeDiffs.length - 1; j >= 0; j--)
        {
            if (timeDiffs[j][0] != 0) {
                var msg = Math.abs(timeDiffs[j][0]) + " " + timeDiffs[j][1];                
                if (Math.abs(timeDiffs[j][0]) > 1)
                    msg += "s";
                if (timeDiffs[j][0] > 0)
                    msg += " ago";
                else
                    msg = "In " + msg;
                relativeDates.push(msg);
                break;
            }
        }
    }
    return relativeDates;
}


// compute time differential in all usual units
function computeDifferentials(diffTime) {
    return [
        [Math.trunc(diffTime / 1000), "second"],
        [Math.trunc(diffTime / 60000), "minute"],
        [Math.trunc(diffTime / 3600000), "hour"],
        [Math.trunc(diffTime / 86400000), "day"],
        [Math.trunc(diffTime / 604800000), "week"],
        [Math.trunc(diffTime / 2628000000), "month"],
        [Math.trunc(diffTime / 31535965310), "year"]
    ]
}
