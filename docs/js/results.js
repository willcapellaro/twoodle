var canvasSize = [null, null];
var arcSize = 0.01;
var idsOrder = [];

var itemMoved = -1;
function getIdsOrder(axis)
{
    idsOrder = [];
    var c = document.getElementById(axis + 'ItemsList').children;
    for (var i = 0; i < c.length; i++)
    {
        idsOrder.push(Number(c[i].id.split('_')[2]));
    }
    if (idsOrder.length == twoodles[selectedTwoodleIndex]['items'].length)
    {
        var preValues = [...twoodles[selectedTwoodleIndex]['yValues']];
        if (axis == 'x')
        {
            preValues = [...twoodles[selectedTwoodleIndex]['xValues']];
        }

        var changes = false;
        for (var i = 0; i < idsOrder.length; i++)
        {
            if (preValues[i]['index'] != idsOrder[i])
            {
                changes = true;
                i = idsOrder.length;
            }
        }
        if (changes)
        {
            var auxPreValues = [];
            for (var i = 0; i < idsOrder.length; i++)
            {
                for (var j = 0; j < preValues.length; j++)
                {
                    if (preValues[j]['index'] == idsOrder[i])
                    {
                        auxPreValues.push(preValues[j]);
                    }
                }
            }
            if (axis == 'y')
            {
                twoodles[selectedTwoodleIndex]['yValues'] = auxPreValues;
            }
            if (axis == 'x')
            {
                twoodles[selectedTwoodleIndex]['xValues'] = auxPreValues;
            }
            distribute(axis);
            saveValues();
        }
    }
    else
    {
        for (var i = 0; i < idsOrder.length - 1; i++)
        {
            for (var j = (i + 1); j < idsOrder.length; j++)
            {
                if (idsOrder[i] == idsOrder[j])
                {
                    itemMoved = idsOrder[i];
                }
            }
        }
        setTimeout(() => { getIdsOrder(axis); }, 100);
    }
}
function fillAxisNames()
{
    document.getElementById('labelLowY').innerHTML = 'Low ' + yAxisName;
    document.getElementById('labelHighY').innerHTML = 'High ' + yAxisName;
    document.getElementById('labelLowX').innerHTML = 'Low ' + xAxisName;
    document.getElementById('labelHighX').innerHTML = 'High ' + xAxisName;
}
function drawResult()
{
    var fontPx = 15;
    var w;
    var h;
    var found = false;
    
    var strokeStyleOfQuadrants = 'grey';
    var fillStyleOfItems = "#000000";
    var fillStyleOFQuadrantsText = "lightblue";

    var rules;
    try
    {
        rules = document.getElementById('cssFile').sheet.cssRules;
        for (var i = 0; i < rules.length; i++)
        {
            if (rules[i].selectorText.split('#')[1] == 'canvas')
            {
                w = Number(rules[i].style.width.split('px')[0]);
                h = Number(rules[i].style.height.split('px')[0]);
                found = true;
            }
        }
    }
    catch
    {
        try
        {
            rules = document.styleSheets;
            for (var i = 0; i < rules.length; i++)
            {
                if (rules[i].selectorText.split('#')[1] == 'canvas')
                {
                    w = Number(rules[i].style.width.split('px')[0]);
                    h = Number(rules[i].style.height.split('px')[0]);
                    found = true;
                }
            }
        }
        catch
        {
            w = 500;
            h = 500;
        }
    }
    if (!found)
    {
        w = 500;
        h = 500;
    }
    canvasSize = [w, h];
    $('#canvas').remove();
    $("#canvasDiv").append('<canvas class="canvasImage" width=' + canvasSize[0] + ' height=' + canvasSize[1] + ' id="canvas">Canvas not supported.</canvas>');
    canvas = document.getElementById('canvas').getContext('2d');
    canvas.strokeStyle = strokeStyleOfQuadrants;
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(canvasSize[0], 0);
    canvas.lineTo(canvasSize[0], canvasSize[1]);
    canvas.lineTo(0, canvasSize[1]);
    canvas.lineTo(0, 0);
    canvas.stroke();
    
    canvas.beginPath();
    canvas.moveTo((canvasSize[0] / 2), 0);
    canvas.lineTo((canvasSize[0] / 2), canvasSize[1]);
    canvas.stroke();

    canvas.beginPath();
    canvas.moveTo(0, (canvasSize[1] / 2));
    canvas.lineTo(canvasSize[0], (canvasSize[1] / 2));
    canvas.stroke();
    
    canvas.fillStyle = fillStyleOFQuadrantsText;
    var texts = conditionals(xAxisName, yAxisName);
    var cuadrantsPositions = [
        [0.75, 0.25], 
        [0.25, 0.25], 
        [0.75, 0.75], 
        [0.25, 0.75]
    ];
    
    for (var i = 0; i < texts.length; i++)
    {
        canvas.font = (fontPx*2) + "px 'Poppins'"; 
        if (texts[i].length > 16)
        {
            var disminution = 0.01;
            canvas.font = (fontPx * 1.99) + "px 'Poppins'";
            while (canvas.measureText(texts[i]).width >= (canvasSize[0] * 0.49))
            {
                disminution += 0.01;
                canvas.font = (fontPx * (2 - disminution)) + "px 'Poppins'";
            }
        }
        canvas.fillText(texts[i], (canvasSize[0] * cuadrantsPositions[i][0]) - (canvas.measureText(texts[i]).width * 0.5), (canvasSize[1] * cuadrantsPositions[i][1]) + (fontPx * 0.5));
    }
    
    canvas.fillStyle = fillStyleOfItems;
    for (var i = 0; i < twoodles[selectedTwoodleIndex]['yValues'].length; i++)
    {
        var xText = 12;
        var yText = fontPx * 0.3;

        canvas.font = fontPx + "px 'Poppins'";
        var y = (canvasSize[1] * (1 - (twoodles[selectedTwoodleIndex]['yValues'][i]['value'] / 100)));
        var x;
        var xIndex;
        for (var j = 0; j < twoodles[selectedTwoodleIndex]['xValues'].length; j++)
        {
            if (twoodles[selectedTwoodleIndex]['xValues'][j]['index'] == twoodles[selectedTwoodleIndex]['yValues'][i]['index'])
            {
                x = (canvasSize[0] * (twoodles[selectedTwoodleIndex]['xValues'][j]['value'] / 100));
                xIndex = j;
            }
        }

        if (y >= (canvasSize[1] - (fontPx * 1.5)))
        {
            yText = -(fontPx * 0.4);
        }
        if (y <= (fontPx * 0.7))
        {
            yText = (fontPx * 1.1);
        }

        if (twoodles[selectedTwoodleIndex]['xValues'][xIndex]['value'] > 50)
        {
            xText = -12;
            for (var j = 0; j < twoodles[selectedTwoodleIndex]['items'].length; j++)
            {
                if (twoodles[selectedTwoodleIndex]['items'][j]['index'] == twoodles[selectedTwoodleIndex]['yValues'][i]['index'])
                {
                    xText -= canvas.measureText(twoodles[selectedTwoodleIndex]['items'][j]['name']).width;
                }
            }
        }
        canvas.font = fontPx + "px 'Poppins'";
        canvas.fillText(document.getElementById('item_name_' + twoodles[selectedTwoodleIndex]['yValues'][i]['index']).value, x + xText, y + yText);
        canvas.fillStyle = '';
        
        canvas.beginPath();
        canvas.arc((canvasSize[0] * (twoodles[selectedTwoodleIndex]['xValues'][xIndex]['value'] / 100)), (canvasSize[1] * (1 - (twoodles[selectedTwoodleIndex]['yValues'][i]['value'] / 100))), ((canvasSize[0] * arcSize) + (canvasSize[1] * arcSize)) / 2 , 10, Math.PI, true);
        canvas.fill();
    }
}