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
{console.log(axis);//here
    /*getValues();
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
    }*/
}
function getValues()
{
    /*yValues = [];
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
    }*/
    var c = document.getElementById('yDivRange').getElementsByTagName('div');
    var auxC = [];
    for (var i = 0; i < c.length; i++)
    {//console.log(c[i]);
        auxC.push(c[i].getElementsByTagName('input')[0]);//console.log(c[i].getElementsByTagName('input')[0]);
    }
    c = auxC;
    for (var i = 0; i < c.length; i++)
    {//console.log(c[i]);
        for (var j = 0; j < items.length; j++)
        {//console.log(items[j]['index'], Number(c[i].id.split('_')[3]));
            if (items[j]['index'] == Number(c[i].id.split('_')[3]))
            {
                items[j]['yValue'] = Number(c[i].value);//console.log(items[j]['yValue']);
            }
        }
        //document.getElementById('lblItem_' + c[i].id.split('_')[1]).innerHTML = '';
    }
    c = document.getElementById('xDivRange').getElementsByTagName('div');
    for (var i = 0; i < c.length; i++)
    {
        auxC.push(c[i].getElementsByTagName('input')[0]);
    }
    c = auxC;
    for (var i = 0; i < c.length; i++)
    {
        for (var j = 0; j < items.length; j++)
        {
            if (items[j]['index'] == Number(c[i].id.split('_')[3]))
            {
                items[j]['xValue'] = Number(c[i].value);
            }
        }
    }
}
function fillAxisNames()
{
    document.getElementById('labelLowY').innerHTML = 'Low ' + yAxisName;
    document.getElementById('labelHighY').innerHTML = 'High ' + yAxisName;
    document.getElementById('labelLowX').innerHTML = 'Low ' + xAxisName;
    document.getElementById('labelHighX').innerHTML = 'High ' + xAxisName;
}

function drawQuadHints()
{
    canvas.font = fontPx + "px Arial";
    canvas.fillText(document.getElementById('item_name_' + pre_yIdsOrder[i]).value, x + xText, y + yText);
    canvas.fillStyle = '';
    canvas.beginPath();
    canvas.arc((canvasSize[0] * (xValues[Number(pre_xIdsOrder[i])] / 100)), (canvasSize[1] * (1 - (yValues[Number(pre_yIdsOrder[i])] / 100))), ((canvasSize[0] * arcSize) + (canvasSize[1] * arcSize)) / 2 , 10, Math.PI, true);
    canvas.fill();
 }

function drawResult()
{
    var fontPx = 15;
    var w;
    var h;
    var found = false;
    
    var strokeStyleOfQuadrants = '#ff0000';
    var fillStyleOfItems = "#000000";
    var fillStyleOFQuadrantsText = "#ff0000";

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
    
    canvas.fillStyle = fillStyleOfItems;
    //for (var i = 0; i < namesMaster.length; i++)
    for (var i = 0; i < items.length; i++)
    {
        var xText = 12;
        var yText = fontPx * 0.3;

        canvas.font = fontPx + "px Arial";
        var x = (canvasSize[0] * (items[i]['xValue'] / 100));
        var y = (canvasSize[1] * (1 - (items[i]['yValue'] / 100)));

        if (y >= (canvasSize[1] - (fontPx * 1.5)))
        {
            yText = -(fontPx * 0.4);
        }
        if (y <= (fontPx * 0.7))
        {
            yText = (fontPx * 1.1);
        }

        if (items[i]['xValue'] > 50)
        {
            xText = -12;
            xText -= canvas.measureText(items[i]['name']).width;
        }

        canvas.font = fontPx + "px Arial";
        canvas.fillText(items[i]['name'], x + xText, y + yText);
        canvas.fillStyle = '';
        canvas.beginPath();
        canvas.arc((canvasSize[0] * (items[i]['xValue'] / 100)), (canvasSize[1] * (1 - (items[i]['yValue'] / 100))), ((canvasSize[0] * arcSize) + (canvasSize[1] * arcSize)) / 2 , 10, Math.PI, true);
        canvas.fill();
    }
    canvas.fillStyle = fillStyleOFQuadrantsText;

    var texts = conditionals(xAxisName, yAxisName);
    
    canvas.fillText(texts[0], (canvasSize[0] * 0.25) - (canvas.measureText(texts[0]).width * 0.5), (canvasSize[1] * 0.25) + (fontPx * 0.5));
    canvas.fillText(texts[1], (canvasSize[0] * 0.75) - (canvas.measureText(texts[1]).width * 0.5), (canvasSize[1] * 0.25) + (fontPx * 0.5));
    canvas.fillText(texts[2], (canvasSize[0] * 0.25) - (canvas.measureText(texts[2]).width * 0.5), (canvasSize[1] * 0.75) + (fontPx * 0.5));
    canvas.fillText(texts[3], (canvasSize[0] * 0.75) - (canvas.measureText(texts[3]).width * 0.5), (canvasSize[1] * 0.75) + (fontPx * 0.5));
}