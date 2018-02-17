// Project: Time data in documents
// Subject: Internet Applications
// Author: Nikola Valesova, xvales02


var timer = null;
var timelineHeight = 0;
var timestampDiff = 70;


function main() {
    var controlsElement = document.getElementsByClassName('controls');
    if (controlsElement.length != 0)
        controlsElement[0].innerHTML = createControls();
    drawTimeline();
    absoluteDates();
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

    var timeline = "<h3>Timeline:</h3>";
    var canvasElement = "<canvas id=\"timelineCanvas\" width=\"600\" height=\"";
    canvasElement += timelineHeight + 2 * 15;
    // TODO remove border
    canvasElement += "\" style=\"border:1px solid #d3d3d3;\">Your browser does not support the HTML5 canvas tag.</canvas>";

    return timeline + canvasElement;
}


function drawTimeline() {
    var c = document.getElementById("timelineCanvas");
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(200, 15);
    ctx.lineTo(200, timelineHeight + 15);
    ctx.stroke();

    addPoints(ctx);
}


function addPoints(ctx) {
    var timeStamps = getAllTimeStamps();
    var timeDiffs = getTimeDiffs(timeStamps);
    var options = {
        year: "numeric", month: "short", // weekday: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit"  
    };

    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.font = "17px Times New Roman";
    var oneStep = timeDiffs[timeDiffs.length - 1] != 0 ? timelineHeight / timeDiffs[timeDiffs.length - 1] : 0;

    for (var i = 0; i < timeStamps.length; i++) {
        ctx.arc(200, timeDiffs[i] * oneStep + 15, 7, 0, 2*Math.PI);        
        ctx.fillText(timeStamps[i][0].toLocaleDateString("en-US", options) + ": " + timeStamps[i][1], 220, timeDiffs[i] * oneStep + 20); 
    }
    ctx.fill();
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
    if (document.getElementById("absolute_time").checked) {
        if (timer != null) {
            clearInterval(timer);
            timer = null;
        }
        absoluteDates();
    }
    else {
        if (timer == null)
            timer = setInterval(function(){changeTimestamps();}, 60000);
        relativeDates();        
    }
}


function absoluteDates() {
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;

    for (var i = 0; i < timeElementCount; i++) {
        var absTime = new Date(timeElements[i].dateTime);
        var options = {
            year: "numeric", month: "short", // weekday: "long",
            day: "numeric", hour: "2-digit", minute: "2-digit"  
        };
        timeElements[i].innerHTML = absTime.toLocaleDateString("en-US", options); 
    }
}


function relativeDates() {
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;

    for (var i = 0; i < timeElementCount; i++) {
        var diffTime = new Date() - new Date(timeElements[i].dateTime);
        var timeDiffs = computeDifferentials(diffTime);

        for (var j = timeDiffs.length - 1; j >= 0; j--)
        {
            if (timeDiffs[j][0] != 0) {
                var msg = Math.abs(timeDiffs[j][0]) + " " + timeDiffs[j][1];                
                if (Math.abs(timeDiffs[j][0]) > 1)
                    msg += "s";
                if (timeDiffs[j][0] > 0)
                    timeElements[i].innerHTML = msg + " ago";
                else
                    timeElements[i].innerHTML = "in " + msg;
                break;
            }
        }
    }
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