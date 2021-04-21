var canvasSize = [null, null];
var arcSize = 0.01;

var yValues = [];
var xValues = [];

var pre_yIdsOrder = [];
var pre_xIdsOrder = [];
var idsOrder = [];

var itemMoved = -1;
function getPreviousIdsOrder()
{
    pre_yIdsOrder = [];
    pre_xIdsOrder = [];
    for (var i = 0; i < document.getElementById('itemsList').children.length; i++)
    {
        pre_yIdsOrder.push(i);
        pre_xIdsOrder.push(i);
    }
}
function getIdsOrder(axis)
{
    getValues();
    var values = [...yValues];
    var pre_idsOrder = [...pre_yIdsOrder];
    idsOrder = [];
    var c = document.getElementById(axis + 'ItemsList').children;
    for (var i = 0; i < c.length; i++)
    {
        idsOrder.push(c[i].id.split('_')[2]);
    }
    if (axis == 'x')
    {
        pre_idsOrder = [...pre_xIdsOrder];
        values = [...xValues];
    }
    if (idsOrder.length == namesMaster.length)
    {
        var changes = false;
        for (var i = 0; i < idsOrder.length; i++)
        {
            if (pre_idsOrder[i] != idsOrder[i])
            {
                changes = true;
                i = idsOrder.length;
            }
        }
        if (changes)
        {
            c = document.getElementById(axis + 'DivRange').children;
            for (var i = 0; i < idsOrder.length; i++)
            {
                for (var j = 0; j < c.length; j++)
                {
                    if (Number(c[j].getElementsByClassName(axis + 'Range')[0].id.split('_')[3]) == Number(pre_idsOrder[i]))
                    {
                        c[j].getElementsByClassName(axis + 'Range')[0].value = values[Number(pre_idsOrder[i])];
                        c[j].style.top = document.getElementById(axis + '_item_' + pre_idsOrder[i]).offsetTop + 'px';
                        j = c.length;
                    }
                }
            }
            for (var i = 0; i < idsOrder.length; i++)
            {
                if (idsOrder[i] == itemMoved)
                {
                    if (i == 0)
                    {
                        document.getElementById('range_' + axis + '_item_' + itemMoved).value = 100;
                        verifyDifferentValues(axis);
                    }
                    else
                    {
                        if (i == (idsOrder.length - 1))
                        {
                            document.getElementById('range_' + axis + '_item_' + itemMoved).value = 0;
                            verifyDifferentValues(axis);
                        }
                        else
                        {
                            var up = Number(document.getElementById('range_' + axis + '_item_' + idsOrder[i - 1] ).value);
                            var down = Number(document.getElementById('range_' + axis + '_item_' + idsOrder[i + 1] ).value);
                            document.getElementById('range_' + axis + '_item_' + itemMoved).value = (up + down) / 2;
                        }
                    }
                }
            }
        }
        pre_idsOrder = [...idsOrder];
        if (axis == 'x')
        {
            pre_xIdsOrder = [...idsOrder];
        }
        else
        {
            pre_yIdsOrder = [...idsOrder];
        }
        var c = document.getElementById('itemsList').children;
        for (var i = 0; i < idsOrder.length; i++)
        {
            if (Number(c[i].id.split('_')[1]) != Number(idsOrder[i]))
            {
                document.getElementById('opt' + axis.toUpperCase() + 'm').disabled = false;
                i = idsOrder.length;
            }
            else
            {
                document.getElementById('opt' + axis.toUpperCase() + 'm').disabled = true;
            }
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
function getValues()
{
    yValues = [];
    xValues = [];
    var c = document.getElementById('yDivRange').getElementsByTagName('div');
    for (var i = 0; i < c.length; i++)
    {
        yValues.push(50);
        xValues.push(50);
    }
    for (var i = 0; i < pre_yIdsOrder.length; i++)
    {
        try
        {
            yValues[Number(pre_yIdsOrder[i])] = Number(document.getElementById('range_y_item_' + pre_yIdsOrder[i]).value);
        }catch{}
    }
    for (var i = 0; i < pre_xIdsOrder.length; i++)
    {
        try
        {
            xValues[Number(pre_xIdsOrder[i])] = Number(document.getElementById('range_x_item_' + pre_xIdsOrder[i]).value);
        }catch{}
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
    var extra_x = 0;
    for (var i = 0; i < namesMaster.length; i++)
    {
        if ((fontPx * 1.15 * namesMaster[i].length) > extra_x)
        {
            extra_x = (fontPx * 1.15 * namesMaster[i].length);
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
    var top = document.getElementById('canvasImage').offsetTop;
    $('#canvas').remove();
    $("#seeDiv").append('<canvas style="position: absolute;" width=' + (canvasSize[0] + extra_x) + ' height=' + canvasSize[1] + ' id="canvas">Canvas not supported.</canvas>');
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

    for (var i = 0; i < namesMaster.length; i++)
    {
        var xText = 12;
        var yText = fontPx * 0.3;

        canvas.font = fontPx + "px Arial";
        var x = (canvasSize[0] * (xValues[Number(pre_xIdsOrder[i])] / 100));
        var y = (canvasSize[1] * (1 - (yValues[Number(pre_yIdsOrder[i])] / 100)));

        if (y >= (canvasSize[1] - (fontPx * 1.5)))
        {
            yText = -(fontPx * 0.4);
        }
        if (y <= (fontPx * 0.7))
        {
            yText = (fontPx * 1.1);
        }

        canvas.font = fontPx + "px Arial";
        canvas.fillText(document.getElementById('item_name_' + pre_yIdsOrder[i]).value, x + xText, y + yText);
        
        canvas.fillStyle = '';
        canvas.beginPath();
        canvas.arc((canvasSize[0] * (xValues[Number(pre_xIdsOrder[i])] / 100)), (canvasSize[1] * (1 - (yValues[Number(pre_yIdsOrder[i])] / 100))), ((canvasSize[0] * arcSize) + (canvasSize[1] * arcSize)) / 2 , 10, Math.PI, true);
        canvas.fill();
    }
}
function generateImage()
{
    var top = document.getElementById('tableSee').offsetTop + document.getElementById('tdHighY').offsetHeight;
    var left = document.getElementById('tableSee').offsetLeft + document.getElementById('tdLowX').offsetWidth;
    document.getElementById('canvas').style.top = top + 'px';
    document.getElementById('canvas').style.left = left + 'px';
}