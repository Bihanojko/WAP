// Project: Time data in documents
// Subject: Internet Applications
// Author: Nikola Valesova, xvales02


var timer = null;
var timelineHeight = 0;
var timestampDiff = 60;
var canvasWidth = 800;


function main() {
    var controlsElement = document.getElementsByClassName('controls');
    if (controlsElement.length != 0)
        controlsElement[0].innerHTML = createControls();
    changeTimestamps();
}


function createControls() {
    var radioButtons = '<p>Set display method of timestamps<br>';
    radioButtons += 'Absolute: <input type="radio" name="timeformat" id="absolute_time" '
    radioButtons += 'value="absolute" onclick="changeTimestamps()" checked="checked" /><br>';
    radioButtons += 'Relative: <input type="radio" name="timeformat" id="relative_time" '; 
    radioButtons += 'value="relative" onclick="changeTimestamps()" /></p>';
    radioButtons += createTimeline();
    return radioButtons;
}


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


function drawTimeline() {
    var c = document.getElementById("timelineCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 15);
    ctx.lineTo(canvasWidth / 2, timelineHeight + 15);
    ctx.stroke();
}


function addPoints(showDates) {
    var c = document.getElementById("timelineCanvas");
    var ctx = c.getContext("2d");
    var timeStamps = getAllTimeStamps();
    var timeDiffs = getTimeDiffs(timeStamps);

    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.font = "17px Times New Roman";
    var oneStep = timeDiffs[timeDiffs.length - 1] != 0 ? timeDiffs[timeDiffs.length - 1] / timelineHeight : 0;

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


function getCorrespondingEvents(timeStamps, timeDiffs, oneStep, offset) {
    var correspondingEvents = [];
    for (var i = 0; i < timeStamps.length; i++) {
        if (timeDiffs[i] >= offset * oneStep && timeDiffs[i] < (offset + 20) * oneStep)
            correspondingEvents.push(i);
    }
    return correspondingEvents;
}


function getAllTimeStamps() {
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;
    var timeStamps = [];

    for (var i = 0; i < timeElementCount; i++)
        timeStamps.push([new Date(timeElements[i].dateTime), timeElements[i].innerHTML]);

    return timeStamps.sort(function(a, b) {
        return new Date(b[0]) - new Date(a[0]);
      }).reverse();
}


function getTimeDiffs(timeStamps) {
    var timeDiffs = [];
    for (var i = 0; i < timeStamps.length; i++)
        timeDiffs.push((timeStamps[i][0] - timeStamps[0][0]) / 100000);
    return timeDiffs;
}


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


function computeDifferentials(diffTime) {
    return [
        [Math.trunc(diffTime / 1000), "second"],
        [Math.trunc(diffTime / 60000), "minute"],
        [Math.trunc(diffTime / 3600000), "hour"],
        [Math.trunc(diffTime / 86400000), "day"],
        [Math.trunc(diffTime / 604800000), "week"],
        [Math.trunc(diffTime / 2628000000), "month"], // TODO
        [Math.trunc(diffTime / 31535965310), "year"] // TODO
    ]
}

// TODO neprekryvajici se udalosti
// TODO otestovat pro 0, 1 a 2 casovych udalosti
// TODO komentare

// TODO test in Internet Explorer or Microsoft Edge, Firefox and Chrome
// TODO definujte vzhled všech zobrazovaných částí ve zvláštním externím stylovém předpise CSS 
// opatřeném komentáři tak, aby uživatel mohl přizpůsobit vzhled řešení svým potřebám (zejména použité barvy, písmo, velikosti) 
