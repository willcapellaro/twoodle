var canvasSize = [null, null];
var urgencyValues = [];
var importanceValues = [];
var arcSize = 0.01;

function getValues()
{
    urgencyValues = [];
    importanceValues = [];
    var c = document.getElementById('urgencyItemsList').children;
    if (c.length)
    {
        for (var i = 0; i < c.length; i++)
        {
            if (c[i].id.length)
            {
                var urgency = document.getElementById('range_u_item_' + i).value;
                urgencyValues.push(urgency);
                var importance = document.getElementById('range_i_item_' + i).value;
                importanceValues.push(importance);
            }
        }
    }
}
function drawResult()
{
    getValues();
    getNames();
    var fontPx = 15;
    var extra_x = 0;
    for (var i = 0; i < names.length; i++)
    {
        if (urgencyValues[i])
        {
            if ((fontPx * 1.15 * names[i].length) > extra_x)
            {
                extra_x = (fontPx * 1.15 * names[i].length);
            }
        }
    }
    var w;
    var h;
    var found = false;
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
            w = 600;
            h = 500;
        }
    }
    if (!found)
    {
        w = 600;
        h = 500;
    }
    canvasSize = [w, h];

    $('#canvas').remove();
    $("#seeDiv").append('<canvas width=' + (canvasSize[0] + extra_x) + ' height=' + canvasSize[1] + ' id="canvas">Canvas not supported.</canvas>');
    canvas = document.getElementById('canvas').getContext('2d');
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

    canvas.fillStyle = "#000000";

    for (var i = 0; i < names.length; i++)
    {
        if (urgencyValues[i])
        {
            var xText = 12;
            var yText = fontPx * 0.3;

            canvas.font = fontPx + "px Arial";
          
            var x = (canvasSize[0] * (urgencyValues[i] / 100));
            var y = (canvasSize[1] * (1 - (importanceValues[i] / 100)));

            if (y >= (canvasSize[1] - (fontPx * 1.5)))
            {
                yText = -(fontPx * 0.4);
            }
            if (y <= (fontPx * 0.7))
            {
                yText = (fontPx * 1.1);
            }

            canvas.fillText(names[i], x + xText, y + yText);

            canvas.font = fontPx + "px Arial";
            canvas.fillText(names[i], x + xText, y + yText);
        }
        canvas.fillStyle = '';
        canvas.beginPath();
        canvas.arc((canvasSize[0] * (urgencyValues[i] / 100)), (canvasSize[1] * (1 - (importanceValues[i] / 100))), ((canvasSize[0] * arcSize) + (canvasSize[1] * arcSize)) / 2 , 10, Math.PI, true);
        canvas.fill();
    }
}