var validItemsNames = true;
var validAxisNames = true;
var distributing = false;

var yAxisName;
var xAxisName;

function menuItemClicked(item)
{
	if (validItemsNames && validAxisNames)
	{
		switch (item)
		{
			case "items":
				document.getElementById("rateYDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("ItemsDiv").style.display = "block";
				
				document.getElementById('items').classList.add('activeTabButton');
				document.getElementById('rateY').classList.remove('activeTabButton');
				document.getElementById('rateX').classList.remove('activeTabButton');
				document.getElementById('see').classList.remove('activeTabButton');
				break;
			case "rateY":
				getItems();
				saveValues();
				fillLists('x');
				document.getElementById("ItemsDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				
				document.getElementById('items').classList.remove('activeTabButton');
				document.getElementById('rateY').classList.add('activeTabButton');
				document.getElementById('rateX').classList.remove('activeTabButton');
				document.getElementById('see').classList.remove('activeTabButton');
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
				saveValues();
				fillLists('y');
				document.getElementById("ItemsDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "none";
				document.getElementById("rateYDiv").style.display = "none";
				
				document.getElementById('items').classList.remove('activeTabButton');
				document.getElementById('rateY').classList.remove('activeTabButton');
				document.getElementById('rateX').classList.add('activeTabButton');
				document.getElementById('see').classList.remove('activeTabButton');
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
				saveValues();
				fillAxisNames();
				fillLists('y');
				fillLists('x');
				distribute('y');
				distribute('x');
				document.getElementById("ItemsDiv").style.display = "none";
				document.getElementById("rateYDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				document.getElementById("seeDiv").style.display = "block";
				
				document.getElementById('items').classList.remove('activeTabButton');
				document.getElementById('rateY').classList.remove('activeTabButton');
				document.getElementById('rateX').classList.remove('activeTabButton');
				document.getElementById('see').classList.add('activeTabButton');
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
			for (var i = 0; i < twoodles[selectedTwoodleIndex]['yValues'].length; i++)
			{
				if (twoodles[selectedTwoodleIndex]['yValues'][i]['index'] == Number(c[0]['id'].split('_')[3]))
				{
					twoodles[selectedTwoodleIndex]['yValues'][i]['value'] = 100;
				}
			}
		}
		if (axis == 'x')
		{
			for (var i = 0; i < twoodles[selectedTwoodleIndex]['xValues'].length; i++)
			{
				if (twoodles[selectedTwoodleIndex]['xValues'][i]['index'] == Number(c[0]['id'].split('_')[3]))
				{
					twoodles[selectedTwoodleIndex]['xValues'][i]['value'] = 100;
				}
			}
		}
		if (c.length > 1)
		{
			document.getElementById(c[c.length - 1]['id']).innerHTML = 0;
			if (axis == 'y')
			{
				for (var i = 0; i < twoodles[selectedTwoodleIndex]['yValues'].length; i++)
				{
					if (twoodles[selectedTwoodleIndex]['yValues'][i]['index'] == Number(c[c.length - 1]['id'].split('_')[3]))
					{
						twoodles[selectedTwoodleIndex]['yValues'][i]['value'] = 0;
					}
				}
			}
			if (axis == 'x')
			{
				for (var i = 0; i < twoodles[selectedTwoodleIndex]['xValues'].length; i++)
				{
					if (twoodles[selectedTwoodleIndex]['xValues'][i]['index'] == Number(c[c.length - 1]['id'].split('_')[3]))
					{
						twoodles[selectedTwoodleIndex]['xValues'][i]['value'] = 0;
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
						for (var j = 0; j < twoodles[selectedTwoodleIndex]['yValues'].length; j++)
	    				{
	    					if (twoodles[selectedTwoodleIndex]['yValues'][j]['index'] == Number(c[i]['id'].split('_')[3]))
	    					{
	    						twoodles[selectedTwoodleIndex]['yValues'][j]['value'] = Number((100 / (c.length - 1) * ((c.length - 1) - i)).toFixed(2));
	    					}
	    				}
					}
					if (axis == 'x')
					{
						for (var j = 0; j < twoodles[selectedTwoodleIndex]['xValues'].length; j++)
	    				{
	    					if (twoodles[selectedTwoodleIndex]['xValues'][j]['index'] == Number(c[i]['id'].split('_')[3]))
	    					{
	    						twoodles[selectedTwoodleIndex]['xValues'][j]['value'] = Number((100 / (c.length - 1) * ((c.length - 1) - i)).toFixed(2));
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
	for (var i = 0; i < twoodles[selectedTwoodleIndex]['items'].length; i++)
	{
		if (twoodles[selectedTwoodleIndex]['items'][i]['name'].toLowerCase().indexOf('item ') != -1)
		{
			if (Number(twoodles[selectedTwoodleIndex]['items'][i]['name'].toLowerCase().split('item ')[1]) >= nextItemNumber)
			{
				nextItemNumber = Number(twoodles[selectedTwoodleIndex]['items'][i]['name'].toLowerCase().split('item ')[1]) + 1;
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
			<button class="deleteItemButton btn-link" id="` + nextId + `" onclick="deleteItem(this.id);" onmouseover="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseout="itemsListSortable.addContainer(document.getElementById('itemsList'));"><i class="bi bi-trash-fill"></i>  </button>
			<label class="lblRepeatedItem" id="lblItem_` + nextId + `"></label>
		</div>`
	);
	flagShareUpdate = true;
	document.getElementById(c[0].id.split('_')[1]).disabled = false;
	document.getElementById(c[0].id.split('_')[1]).className = 'deleteItemButton btn-link';
	verifyItemsNames(false);
	if (validItemsNames)
	{
		twoodles[selectedTwoodleIndex]['yValues'].push({'value' : 0, 'index' : nextId});
		twoodles[selectedTwoodleIndex]['xValues'].push({'value' : 0, 'index' : nextId});
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
	$('#item_' + Number(item)).remove();
	var j = 0;
	twoodles[selectedTwoodleIndex]['items'] = document.getElementById('itemsList').children;

	for (var i = 0; i < twoodles[selectedTwoodleIndex]['items'].length; i++)
	{
		if (twoodles[selectedTwoodleIndex]['items'][i].id.length)
		{
			var subItems = document.getElementById(twoodles[selectedTwoodleIndex]['items'][i].id).children;
			for (var k = 0; k < subItems.length; k++)
			{
				subItems[k].id = subItems[k].id.replace(subItems[k].id.split('_')[subItems[k].id.split('_').length - 1], j);
			}
			twoodles[selectedTwoodleIndex]['items'][i].id = 'item_' + j;
			j += 1;
		}
	}
	var auxValues = [];
	for (var i = 0; i < twoodles[selectedTwoodleIndex]['yValues'].length; i++)
	{
		if (twoodles[selectedTwoodleIndex]['yValues'][i]['index'] != Number(item))
		{
			if (twoodles[selectedTwoodleIndex]['yValues'][i]['index'] < Number(item))
			{
				auxValues.push(twoodles[selectedTwoodleIndex]['yValues'][i]);
			}
			if (twoodles[selectedTwoodleIndex]['yValues'][i]['index'] > Number(item))
			{
				twoodles[selectedTwoodleIndex]['yValues'][i]['index'] -= 1;
				auxValues.push(twoodles[selectedTwoodleIndex]['yValues'][i]);
			}
		}
	}
	twoodles[selectedTwoodleIndex]['yValues'] = auxValues;
	auxValues = [];
	for (var i = 0; i < twoodles[selectedTwoodleIndex]['xValues'].length; i++)
	{
		if (twoodles[selectedTwoodleIndex]['xValues'][i]['index'] != Number(item))
		{
			if (twoodles[selectedTwoodleIndex]['xValues'][i]['index'] < Number(item))
			{
				auxValues.push(twoodles[selectedTwoodleIndex]['xValues'][i]);
			}
			if (twoodles[selectedTwoodleIndex]['xValues'][i]['index'] > Number(item))
			{
				twoodles[selectedTwoodleIndex]['xValues'][i]['index'] -= 1;
				auxValues.push(twoodles[selectedTwoodleIndex]['xValues'][i]);
			}
		}
	}
	twoodles[selectedTwoodleIndex]['xValues'] = auxValues;
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
		document.getElementById('lblItem_' + repetidos[i]).innerHTML = '<class="lblRepeated"> (repeated name)</p>';
	}
	getItems(shareUpdate && flagShareUpdate);
}
function verifyAxisNames()
{
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;
	document.getElementById('divDuplicatedError').innerHTML = '';
	validAxisNames = true;
	if (document.getElementById('yAxis_name').value.toLowerCase() == document.getElementById('xAxis_name').value.toLowerCase())
	{
		document.getElementById('divDuplicatedError').innerHTML = '<p class="lblRepeated">Error: duplicated label names</p>';
		validAxisNames = false;
	}
	if (document.getElementById('xAxis_name').value == '')
	{
		document.getElementById('divDuplicatedError').innerHTML = '<p class="lblRepeated">Error: empty label name</p>';
		validAxisNames = false;
	}
	if (document.getElementById('yAxis_name').value == '')
	{
		document.getElementById('divDuplicatedError').innerHTML = '<p class="lblRepeated">Error: empty label name</p>';
		validAxisNames = false;
	}
}
function fillLists(axis = null, shareUpdate = true)
{
	var values = [...twoodles[selectedTwoodleIndex]['yValues']];
	var itemsListSortable = yItemsListSortable;
	var axisName = yAxisName;
	if (axis == 'x')
	{
		itemsListSortable = xItemsListSortable;
		values = [...twoodles[selectedTwoodleIndex]['xValues']];
		axisName = xAxisName;
	}
	document.getElementById('lblChange' + axis.toUpperCase()).innerHTML = 'Sort items from highest <strong>' + axisName + '</strong> to lowest <strong> ' +  axisName + '</strong>';

	document.getElementById(axis + 'ItemsList').innerHTML = '';
	var c = document.getElementById(axis + 'ItemsList').children;
	if (!c.length)
	{
		c = document.getElementById('itemsList').children;
	}
	for (var i = 0; i < values.length; i++)
	{
		var n;
		for (var j = 0; j < twoodles[selectedTwoodleIndex]['items'].length; j++)
		{
			if (values[i]['index'] == twoodles[selectedTwoodleIndex]['items'][j]['index'])
			{
				n = twoodles[selectedTwoodleIndex]['items'][j]['name'];
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
function checkLblRecipes()
{
	NElbl = null;
	NWlbl = null;
	SElbl = null;
	SWlbl = null;
	var index = -1;
	for (var i = 0; i < recipes.length; i++)
	{
		if (((xAxisName.toLowerCase() == recipes[i]['defaultX']) && (yAxisName.toLowerCase() == recipes[i]['defaultY'])) || 
			((xAxisName.toLowerCase() == recipes[i]['defaultY']) && (yAxisName.toLowerCase() == recipes[i]['defaultX'])))
		{
			index = i;
			document.getElementById('recipeTitleItemsDiv').innerHTML = recipes[i]['recipeSubName'];
			document.getElementById('recipeTitleRateYDiv').innerHTML = recipes[i]['recipeSubName'];
			document.getElementById('recipeTitleRateXDiv').innerHTML = recipes[i]['recipeSubName'];
			document.getElementById('recipeTitleSeeDiv').innerHTML = recipes[i]['recipeSubName'];

			auxDefaultX = recipes[i]['defaultX'];
			auxDefaultY = recipes[i]['defaultY'];
			NElbl = recipes[i]['quadrantLabels'][0].toLowerCase();
			NWlbl = recipes[i]['quadrantLabels'][1].toLowerCase();
			SElbl = recipes[i]['quadrantLabels'][2].toLowerCase();
			SWlbl = recipes[i]['quadrantLabels'][3].toLowerCase();
			recipes[i]['defaultXY'] = true;
			document.getElementById('swapRestoreBtn').innerHTML = 'Swap X/Y';
			if ((xAxisName.toLowerCase() == recipes[i]['defaultY']) && (yAxisName.toLowerCase() == recipes[i]['defaultX']))
			{
				recipes[i]['defaultXY'] = false;
				SElbl = recipes[i]['quadrantLabels'][1].toLowerCase();
				NWlbl = recipes[i]['quadrantLabels'][2].toLowerCase();
				document.getElementById('swapRestoreBtn').innerHTML = 'Restore X/Y';
			}
		}
	}
	if (index == -1)
	{
		document.getElementById('recipeTitleItemsDiv').innerHTML = 'Custom Recipe';
		document.getElementById('recipeTitleRateYDiv').innerHTML = 'Custom Recipe';
		document.getElementById('recipeTitleRateXDiv').innerHTML = 'Custom Recipe';
		document.getElementById('recipeTitleSeeDiv').innerHTML = 'Custom Recipe';
	}
	return index;
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
			twoodles[selectedTwoodleIndex]['items'] = [];
			for (var i = 0; i < c.length; i++)
			{
				twoodles[selectedTwoodleIndex]['items'].push({'name' : document.getElementById('item_name_' + c[i].id.split('_')[1]).value, 'index' : Number(c[i].id.split('_')[1])});
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
function fillItemsList(items)
{
	document.getElementById('itemsList').innerHTML = '';
	if (items)
	{
		for (var i = 0; i < items.length; i++)
	    {
	    	$("#itemsList").append(`
				<div id="item_` + items[i]['index'] + `" onmouseup="getItems();">
					<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
					<button class="deleteItemButton btn-link" aria-label="Delete" id="` + items[i]['index'] + `" onclick="deleteItem(this.id);" onmouseover="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseout="itemsListSortable.addContainer(document.getElementById('itemsList'));"><i class="bi bi-trash-fill"></i></button>
					<label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label>
				</div>`
			);
	    }
	}
}