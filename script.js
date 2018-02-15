// Project: Time data in documents
// Subject: Internet Applications
// Author: Nikola Valesova, xvales02


var timer = null;


function main() {
    var controlsElement = document.getElementsByClassName('controls');
    if (controlsElement.length != 0)
        controlsElement[0].innerHTML = createControls();

    absoluteDates();
}


function createControls() {
    var radioButtons = '<p>Set display method of timestamps<br>';
    radioButtons += 'Absolute: <input type="radio" name="timeformat" id="absolute_time" value="absolute" onclick="changeTimestamps()" checked="checked" /><br>';
    radioButtons += 'Relative: <input type="radio" name="timeformat" id="relative_time" value="relative" onclick="changeTimestamps()" /></p>';
    radioButtons += createTimeline();
    return radioButtons;
}


// TODO
function createTimeline() {
    var timeStamps = getAllTimeStamps();
    var timeline = "<strong>Timeline:</strong><br>";

    for (var i = 0; i < timeStamps.length; i++)
        timeline += String(timeStamps[i][1]) + "<br>";

    return timeline;
}


function getAllTimeStamps() {
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;
    var timeStamps = [];

    for (var i = 0; i < timeElementCount; i++)
        timeStamps.push([new Date(timeElements[i].dateTime), timeElements[i].innerHTML]);
        // timeStamps += String(new Date(timeElements[i].dateTime).toLocaleDateString("en-US", options)) + "<br>";

    return timeStamps;
}


function changeTimestamps(format) {
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

// TODO test in Internet Explorer or Microsoft Edge, Firefox and Chrome
// TODO definujte vzhled všech zobrazovaných částí ve zvláštním externím stylovém předpise CSS 
// opatřeném komentáři tak, aby uživatel mohl přizpůsobit vzhled řešení svým potřebám (zejména použité barvy, písmo, velikosti) 