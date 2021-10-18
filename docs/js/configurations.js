var validItemsNames = true;
var validAxisNames = true;
var items = [];
var distributing = false;

var yAxisName;
var xAxisName;

function menuItemClicked(item)
{
	if (validItemsNames && validAxisNames)
	{
		switch (item)
		{//It goes through this 'switch' when I click on a button on the top bar.
			case "create":
				document.getElementById("rateYDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("createDiv").style.display = "block";
				
				document.getElementById('create').classList.add('activeTab');
				document.getElementById('rateY').classList.remove('activeTab');
				document.getElementById('rateX').classList.remove('activeTab');
				document.getElementById('see').classList.remove('activeTab');
				break;
			case "rateY":
				getItems();
				saveAxisNames();
				fillLists('x');
				document.getElementById("createDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				
				document.getElementById('create').classList.remove('activeTab');
				document.getElementById('rateY').classList.add('activeTab');
				document.getElementById('rateX').classList.remove('activeTab');
				document.getElementById('see').classList.remove('activeTab');
				if (!(document.getElementById("rateYDiv").style.display == 'block'))
				{
					document.getElementById("rateYDiv").style.display = "block";
					fillLists('y');
				}
				distribute('y');
    			distribute('x');
				break;
			case "rateX":
				getItems();
				saveAxisNames();
				fillLists('y');
				document.getElementById("createDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("rateYDiv").style.display = "none";
				
				document.getElementById('create').classList.remove('activeTab');
				document.getElementById('rateY').classList.remove('activeTab');
				document.getElementById('rateX').classList.add('activeTab');
				document.getElementById('see').classList.remove('activeTab');
				if (!(document.getElementById("rateXDiv").style.display == 'block'))
				{
					document.getElementById("rateXDiv").style.display = "block";
					fillLists('x');
				}
				distribute('y');
    			distribute('x');
				break;
			case "see":
				getItems();
				saveAxisNames();
				fillAxisNames();
				fillLists('y');
				fillLists('x');
				distribute('y');
				distribute('x');
				document.getElementById("createDiv").style.display = "none";
				document.getElementById("rateYDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "block";
				
				document.getElementById('create').classList.remove('activeTab');
				document.getElementById('rateY').classList.remove('activeTab');
				document.getElementById('rateX').classList.remove('activeTab');
				document.getElementById('see').classList.add('activeTab');
				drawResult();
				break;
			default:
				break;
		}
	}
}
function distribute(axis)
{
	var c = document.getElementById(axis + 'ItemsList').getElementsByClassName('itemValue');
	if (c.length)
	{
		distributing = true;
		document.getElementById(c[0]['id']).innerHTML = 100;
		if (axis == 'y')
		{
			for (var i = 0; i < yValues.length; i++)
			{
				if (yValues[i]['index'] == Number(c[0]['id'].split('_')[3]))
				{
					yValues[i]['value'] = 100;
				}
			}
		}
		if (axis == 'x')
		{
			for (var i = 0; i < xValues.length; i++)
			{
				if (xValues[i]['index'] == Number(c[0]['id'].split('_')[3]))
				{
					xValues[i]['value'] = 100;
				}
			}
		}
		if (c.length > 1)
		{
			document.getElementById(c[c.length - 1]['id']).innerHTML = 0;
			if (axis == 'y')
			{
				for (var i = 0; i < yValues.length; i++)
				{
					if (yValues[i]['index'] == Number(c[c.length - 1]['id'].split('_')[3]))
					{
						yValues[i]['value'] = 0;
					}
				}
			}
			if (axis == 'x')
			{
				for (var i = 0; i < xValues.length; i++)
				{
					if (xValues[i]['index'] == Number(c[c.length - 1]['id'].split('_')[3]))
					{
						xValues[i]['value'] = 0;
					}
				}
			}
			if (c.length > 2)
			{
				for (var i = 1; i < (c.length - 1); i++)
				{
					document.getElementById(c[i]['id']).innerHTML = (100 / (c.length - 1) * ((c.length - 1) - i)).toFixed(2);
					if (axis == 'y')
					{
						for (var j = 0; j < yValues.length; j++)
	    				{
	    					if (yValues[j]['index'] == Number(c[i]['id'].split('_')[3]))
	    					{
	    						yValues[j]['value'] = Number((100 / (c.length - 1) * ((c.length - 1) - i)).toFixed(2));
	    					}
	    				}
					}
					if (axis == 'x')
					{
						for (var j = 0; j < xValues.length; j++)
	    				{
	    					if (xValues[j]['index'] == Number(c[i]['id'].split('_')[3]))
	    					{
	    						xValues[j]['value'] = Number((100 / (c.length - 1) * ((c.length - 1) - i)).toFixed(2));
	    					}
	    				}
					}
				}
		    }
		}
		distributing = false;
	}
}
function addItem()
{
	var nextItemNumber = 1;
	for (var i = 0; i < items.length; i++)
	{
		if (items[i]['name'].toLowerCase().indexOf('item ') != -1)
		{
			if (Number(items[i]['name'].toLowerCase().split('item ')[1]) >= nextItemNumber)
			{
				nextItemNumber = Number(items[i]['name'].toLowerCase().split('item ')[1]) + 1;
			}
		}
	}
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
	flagShareUpdate = false;
	$("#itemsList").append(`
		<div id="item_` + nextId + `" onmouseup="getItems();">
			<input class="itemName" type="text" value="Item ` + nextItemNumber + `" id="item_name_` + nextId + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
			<button class="deleteItemButton" id="` + nextId + `" onclick="deleteItem(this.id);"><i class="fas fa-trash"></i></button>
			<label class="lblRepeatedItem" id="lblItem_` + nextId + `"></label>
		</div>`
	);
	flagShareUpdate = true;
	document.getElementById(c[0].id.split('_')[1]).disabled = false;
	document.getElementById(c[0].id.split('_')[1]).className = 'itemBackGround';
	verifyItemsNames(false);
	if (validItemsNames)
	{
		yValues.push({'value' : 0, 'index' : nextId});
		xValues.push({'value' : 0, 'index' : nextId});
		fillLists('y', false);
		fillLists('x', false);
		distribute('y');
		distribute('x');
		saveValues();
	}
}
function deleteItem(item)
{
	var items = document.getElementById('itemsList').children;
	var flag = false;
	var initialId;
	for (var i = 0; i < items.length; i++)
	{
		if (items[i].id.split('_')[1] == item)
		{
			flag = true;
			initialId = i;
		}	
	}
	$('#item_' + Number(item)).remove();
	var j = 0;
	items = document.getElementById('itemsList').children;

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
	var auxValues = [];
	for (var i = 0; i < yValues.length; i++)
	{
		if (yValues[i]['index'] != Number(item))
		{
			if (yValues[i]['index'] < Number(item))
			{
				auxValues.push(yValues[i]);
			}
			if (yValues[i]['index'] > Number(item))
			{
				yValues[i]['index'] -= 1;
				auxValues.push(yValues[i]);
			}
		}
	}
	yValues = auxValues;
	auxValues = [];
	for (var i = 0; i < xValues.length; i++)
	{
		if (xValues[i]['index'] != Number(item))
		{
			if (xValues[i]['index'] < Number(item))
			{
				auxValues.push(xValues[i]);
			}
			if (xValues[i]['index'] > Number(item))
			{
				xValues[i]['index'] -= 1;
				auxValues.push(xValues[i]);
			}
		}
	}
	xValues = auxValues;
	getItems();
}
function verifyItemsNames(shareUpdate = true)
{
	var repetidos = [];
	var auxItems = [];
	var c = document.getElementById('itemsList').children;
	for (var i = 0; i < c.length; i++)
	{
		auxItems.push(document.getElementById('item_name_' + c[i].id.split('_')[1]).value);
	}
	for (var i = 0; i < auxItems.length - 1; i++)
	{
		for (var j = i + 1; j < auxItems.length; j++)
		{
			if (auxItems[i] == auxItems[j])
			{
				repetidos.push(i);
				repetidos.push(j);
			}
		}
	}
	validItemsNames = !repetidos.length;
	for (var i = 0; i < repetidos.length; i++)
	{
		document.getElementById('lblItem_' + repetidos[i]).innerHTML = '<class="lblRepeated" style="color: var(--interaction);"><i class="fas fa-exclamation-triangle"></i> duplicate</p>';
	}
	getItems(shareUpdate && flagShareUpdate);
}
function verifyAxisNames()
{
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;

	document.getElementById('lblYAxisRepeated').innerHTML = '';
	document.getElementById('lblXAxisRepeated').innerHTML = '';
	validAxisNames = true;
	if (document.getElementById('yAxis_name').value == document.getElementById('xAxis_name').value)
	{
		document.getElementById('lblYAxisRepeated').innerHTML = '<p class="lblRepeated"> duplicate</p>';
		document.getElementById('lblXAxisRepeated').innerHTML = '<p class="lblRepeated"> duplicate</p>';
		validAxisNames = false;
	}
	if (document.getElementById('xAxis_name').value == '')
	{
		document.getElementById('lblXAxisRepeated').innerHTML = '<p class="lblRepeated"> (empty name)</p>';
		validAxisNames = false;
	}
	if (document.getElementById('yAxis_name').value == '')
	{
		document.getElementById('lblYAxisRepeated').innerHTML = '<p class="lblRepeated"> (empty name)</p>';
		validAxisNames = false;
	}
}
function fillLists(axis = null, shareUpdate = true)
{
	var values = [...yValues];
	var itemsListSortable = yItemsListSortable;
	var axisName = yAxisName;
	if (axis == 'x')
	{
		itemsListSortable = xItemsListSortable;
		values = [...xValues];
		axisName = xAxisName;
	}
	document.getElementById('lblChange' + axis.toUpperCase()).innerHTML = '<span style="font-weight: 300";><i class="fas fa-arrows-alt-v"></i> Sort items from highest to lowest </span><span class="emphasis">' + axisName + '</span>';
	document.getElementById(axis + 'ItemsList').innerHTML = '';
	var c = document.getElementById(axis + 'ItemsList').children;
	if (!c.length)
	{
		c = document.getElementById('itemsList').children;
	}
	for (var i = 0; i < values.length; i++)
	{
		var n;
		for (var j = 0; j < items.length; j++)
		{
			if (values[i]['index'] == items[j]['index'])
			{
				n = items[j]['name'];
			}
		}
		$("#" + axis + "ItemsList").append(`
			<div class="` + axis + `Item" id="` + axis + `_item_` + values[i]['index'] + `">
				<label class="itemName">` + n + `</label>
				<label id="value_` + axis + `_item_` + values[i]['index'] + `" class="itemValue">` + values[i]['value'] + `</label>
			</div>`
		);
	}
	distribute(axis);
	if (shareUpdate)
	{
		saveValues();
	}
	itemsListSortable.removeContainer(document.getElementById(axis + 'ItemsList'));
	itemsListSortable.addContainer(document.getElementById(axis + 'ItemsList'));
}
function getItems(shareUpdate = true)
{
	if (validItemsNames && validAxisNames)
	{
		var ok = true;
		var ids = [];
		var c = document.getElementById('itemsList').children;
		for (var i = 0; i < c.length; i++)
		{
			if (c[i]['id'].length)
			{
				if (ids.indexOf(c[i]['id']) == -1)
				{
					ids.push(c[i]['id']);
					ok = true;
				}
				else
				{
					ok = false;
					i = c.length;
				}
			}
			else
			{
				ok = false;
				i = c.length;
			}
		}
		if (ok)
		{
			items = [];
			for (var i = 0; i < c.length; i++)
			{
				items.push({'name' : document.getElementById('item_name_' + c[i].id.split('_')[1]).value, 'index' : Number(c[i].id.split('_')[1])});
				document.getElementById('lblItem_' + c[i].id.split('_')[1]).innerHTML = '';
			}
			if (shareUpdate)
			{
				saveValues();
			}
		}
		else
		{
			setTimeout(() => { getItems(); }, 10);
		}
	}
}