var names;
function menuItemClicked(item)
{
    switch (item)
    {
        case "create":
            document.getElementById("rateDiv").style.display = "none";
            document.getElementById("seeDiv").style.display = "none";
            document.getElementById("createDiv").style.display = "block";
            break;
        case "rate":
            document.getElementById("createDiv").style.display = "none";
            document.getElementById("seeDiv").style.display = "none";
            if (!(document.getElementById("rateDiv").style.display == 'block'))
            {
                document.getElementById("rateDiv").style.display = "block";
                fillLists();
            }
            break;
        case "see":
            document.getElementById("createDiv").style.display = "none";
            document.getElementById("rateDiv").style.display = "none";
            document.getElementById("seeDiv").style.display = "block";
            drawResult();
            break;
        default:
            break;
    }
}
function resetValues(id)
{
    if (id == 'importance')
    {
        importanceValues = [];
        for (var i = 0; i < names.length; i++)
        {
            document.getElementById('range_i_item_' + i).value = 50;
        }
    }
    if (id == 'urgency')
    {
        urgencyValues = [];
        for (var i = 0; i < names.length; i++)
        {
            document.getElementById('range_u_item_' + i).value = 50;
        }
    }
    fillLists();
}
function addItem()
{
    var nextId = 0;
    var c = document.getElementById('itemsList').children;
    if (c.length)
    {
        for (var i = 0; i < c.length; i++)
        {
            if (c[i].id.length)
            {
                nextId += 1;
            }
        }
    }
    $("#itemsList").append(`
        <div id="item_` + nextId + `">
            <input class="itemName" type="text" value="Item ` + (nextId + 1) + `" id="item_name_` + nextId + `">
            <button class="deleteItemButton" id="` + nextId + `" onclick="deleteItem(this.id);">Delete</button>
            <label class="lblRepeatedItem" id="lblItem_` + nextId + `"></label>
        </div>`
    );
    verifyItemsNames();
}
function deleteItem(item)
{
    $('#item_' + Number(item)).remove()
    var j = 0;
    var items = document.getElementById('itemsList').children;

    if (items.length)
    {
        for (var i = 0; i < items.length; i++)
        {
            if (items[i].id.length)
            {
                var subItems = document.getElementById(items[i].id).children;
                for (var k = 0; k < subItems.length; k++)
                {
                    subItems[k].id = subItems[k].id.replace(subItems[k].id.split('_')[subItems[k].id.split('_').length - 1], j);
                }
                items[i].id = 'item_' + j;
                j += 1;
            }
        }
    }
}
function verifyItemsNames()
{
    document.getElementById('see').disabled = false;
    document.getElementById('rate').disabled = false;

    getNames();
    var repetidos = [];
    for (var i = 0; i < names.length - 1; i++)
    {
        for (var j = i + 1; j < names.length; j++)
        {
            if (names[i] == names[j])
            {
                repetidos.push(i);
                repetidos.push(j);
            }
        }
    }
    document.getElementById('see').disabled = repetidos.length;
    document.getElementById('rate').disabled = repetidos.length;
    for (var i = 0; i < repetidos.length; i++)
    {
        document.getElementById('lblItem_' + repetidos[i]).innerHTML = ' (repeated name)';
    }
}
function fillLists()
{
    getNames();
    document.getElementById('urgencyItemsList').innerHTML = '';
    document.getElementById('importanceItemsList').innerHTML = '';
    for (var i = 0; i < names.length; i++)
    {
        var htmlUrgency = '';
        var htmlImportance = '';
        if (urgencyValues.length)
        {
            htmlUrgency = ' value="' + urgencyValues[i] + '"';
        }
        if (importanceValues.length)
        {
            htmlImportance = ' value="' + importanceValues[i] + '"';
        }
        $("#urgencyItemsList").append(`
            <div class="urgencyItem" id="u_item_` + i + `">
                <label class="itemName">` + names[i] + `</label>
                <label class="lblLowUrgency">Low urgency</label>
                <input type="range" class="urgencyRange custom-range" id="range_u_item_` + i + `" min="0" max="100"` + htmlUrgency + `>
                <label class="lblHighUrgency">High urgency</label>
            </div>`
        );
        $("#importanceItemsList").append(`
            <div class="importanceItem" id="i_item_` + i + `">
                <label class="itemName">` + names[i] + `</label>
                <label class="lblLowImportace">Low importance</label>
                <input type="range" class="importanceRange custom-range" id="range_i_item_` + i + `" min="0" max="100"` + htmlImportance + `>
                <label class="lblHighImportace">High importance</label>
            </div>`
        );
    }
}
function getNames()
{
    names = [];
    var c = document.getElementById('itemsList').children;
    if (c.length)
    {
        for (var i = 0; i < c.length; i++)
        {
            if (c[i].id.length)
            {
                var name = document.getElementById('item_name_' + c[i].id.split('_')[1]).value;
                document.getElementById('lblItem_' + c[i].id.split('_')[1]).innerHTML = '';
                names.push(name);
            }
        }
    }
}