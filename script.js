function Hello() {
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;

    // for (var i = 0; i < timeElementCount; i++) {
    //     alert(convertDate(timeElements[i]));
    // }

    var controlsElement = document.getElementsByClassName('controls');
    if (controlsElement.length != 0)
        controlsElement[0].innerHTML = createControls();

}


function createControls()
{
    var radioButtons = '<p>Set display method of timestamps<br>';
    radioButtons += 'Absolute: <input type="radio" name="timeformat" value="absolute" onclick="changeTimestamps(0)" checked="checked" /><br>';
    radioButtons += 'Relative: <input type="radio" name="timeformat" value="relative" onclick="changeTimestamps(1)" /></p>';
    radioButtons += createTimeline();
    return radioButtons;
}


// TODO
function createTimeline()
{
    return "";
}


// TODO
function changeTimestamps(format)
{
    if (format == 0)
    {
        alert("ZERO");
    }
    else
    {
        alert("ONE");
        relativeDates();
    }
}


function relativeDates()
{
    var timeElements = document.getElementsByTagName("time");
    var timeElementCount = timeElements.length;

    for (var i = 0; i < timeElementCount; i++) {
        var diffTime = new Date() - new Date(timeElements[i].dateTime);
        var timeDiffs = computeDifferentials(diffTime);

        for (var i = timeDiffs.length - 1; i >= 0; i--)
        {
            if (timeDiffs[i][0] > 0) {
                var msg = timeDiffs[i][0] + " " + timeDiffs[i][1];                
                if (timeDiffs[i][0] > 1)
                    msg += "s";
                alert(msg + " ago")
                break;
            }

            if (timeDiffs[i][0] < 0) {
                var msg = "In " + timeDiffs[i][0] + " " + timeDiffs[i][1];                
                if (timeDiffs[i][0] > 1)
                    msg += "s";
                alert(msg)
                break;
            }
        }
    }

    setTimeout(function(){relativeDates()}, 60000);
    return;
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


function convertDate(timeElement)
{
    var eventTime = new Date(timeElement.dateTime);
    var nowTime = new Date();
    return (nowTime - eventTime) / 1000;
}
