var validItemsNames = true;
var validAxisNames = true;
var distributing = false;

var yAxisName;
var xAxisName;

var selectedItem;
var selectedTwoodleMoveIndex;

function menuItemClicked(item)
{
	switch (item)
	{
		case "items":
			document.getElementById("rateYDiv").style.display = "none";
			document.getElementById("rateXDiv").style.display = "none";
			document.getElementById("resultsDiv").style.display = "none";
			document.getElementById("ItemsDiv").style.display = "block";
			
			document.getElementById('items').classList.add('activeTabButton');
			document.getElementById('rateY').classList.remove('activeTabButton');
			document.getElementById('rateX').classList.remove('activeTabButton');
			document.getElementById('see').classList.remove('activeTabButton');
			fillItemsList();
			break;
		case "rateY":
			if (validItemsNames && validAxisNames)
			{
				getItems();
				saveValues();
				fillLists('x');
				document.getElementById("ItemsDiv").style.display = "none";
				document.getElementById("resultsDiv").style.display = "none";
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
			}
			break;
		case "rateX":
			if (validItemsNames && validAxisNames)
			{
				getItems();
				saveValues();
				fillLists('y');
				document.getElementById("ItemsDiv").style.display = "none";
				document.getElementById("resultsDiv").style.display = "none";
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
			}
			break;
		case "see":
			if (validItemsNames && validAxisNames)
			{
				getItems();
				saveValues();
				fillAxisNames();
				fillLists('y');
				fillLists('x');
				document.getElementById("ItemsDiv").style.display = "none";
				document.getElementById("rateYDiv").style.display = "none";
				document.getElementById("rateXDiv").style.display = "none";
				document.getElementById("resultsDiv").style.display = "block";
				
				document.getElementById('items').classList.remove('activeTabButton');
				document.getElementById('rateY').classList.remove('activeTabButton');
				document.getElementById('rateX').classList.remove('activeTabButton');
				document.getElementById('see').classList.add('activeTabButton');
				drawResult();
				displayLocalStorage('quadrants');
			}
			break;
		default:
			break;
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
		var i = 0;
		while (i < c.length)
		{
			if (Number(c[i].id.split('_')[1]) == nextId)
			{
				nextId++;
				i = -1;
			}
			i++;
		}
	}
	flagShareUpdate = false;
	$("#itemsList").append(`
		<div id="item_` + nextId + `" onmouseup="getItems();" class="itemsListCard">
			<input class="itemName" type="text" value="Item ` + nextItemNumber + `" id="item_name_` + nextId + `">
			<div class="btn-link trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(` + nextId + `);"></i></div>
			<div class="btn-link arrowIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(` + nextId + `);"></i></div>
			<div class="btn-link pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(` + nextId + `);"></i></div>
			<div><label class="lblRepeatedItem" id="lblItem_` + nextId + `"></label></div>
		</div>`
	);
	flagShareUpdate = true;
	verifyItemsNames(false);
	if (validItemsNames)
	{
		twoodles[selectedTwoodleIndex]['yValues'].push({'value' : 0, 'index' : nextId});
		twoodles[selectedTwoodleIndex]['xValues'].push({'value' : 0, 'index' : nextId});
		fillLists('y', false);
		fillLists('x', false);
		saveValues();
		drawResult();
		displayLocalStorage('quadrants');
	}
}
function preMoveItem(id)
{
	document.getElementById('inputItemUrl').parentNode.style.display = 'block';
	selectedItem = id;
	for (var i = 0; i < twoodles[selectedTwoodleIndex]['items'].length; i++)
	{
		if (twoodles[selectedTwoodleIndex]['items'][i]['index'] == selectedItem)
		{
			document.getElementById('lblMoveItemName').innerHTML = 'Move Item "' + twoodles[selectedTwoodleIndex]['items'][i]['name'] + '" to';
		}
	}
	var html = '';
	for (var i = 0; i < twoodles.length; i++)
	{
		html += '<option id="optSlcTwoodlesMove_' + twoodles[i]['id'] + '">' + twoodles[i]['name'] + '</option>';
	}
	document.getElementById('slcTwoodlesMove').innerHTML = html;
	$('#modalMove').modal('show');
}
function selectTwoodleMove()
{
	if (document.getElementById('slcTwoodlesMove').selectedIndex != -1)
	{
		var selectedTwoodleMove = Number(document.getElementById('slcTwoodlesMove').children[document.getElementById('slcTwoodlesMove').selectedIndex].id.split('_')[1]);
		for (var i = 0; i < twoodles.length; i++)
		{
			if (twoodles[i]['id'] == selectedTwoodleMove)
			{
				selectedTwoodleMoveIndex = twoodles[i]['id'];
			}
		}
	}
}
var ubication = 'bottom';
function selectTwoodleTopBottom(e = document.getElementById('lblTop'))
{
	ubication = e.id.split('lbl')[1].toLowerCase();
	e.classList.add('selectedUbicationButton');
	document.getElementById('lblBottom').classList.remove('selectedUbicationButton');
	if (ubication == 'bottom')
	{
		e.classList.add('selectedUbicationButton');
		document.getElementById('lblTop').classList.remove('selectedUbicationButton');
	}
}
function nextIndex(json, index)
{
	var exists = false;
	for (var i = 0; i < json.length; i++)
	{
		if (json[i]['index'] == index)
		{
			exists = true;
		}
	}
	if (!exists)
	{
		return index;
	}
	var minIndex = 0;
	var i = 0;
	while (i < json.length)
	{
		if (json[i]['index'] == minIndex)
		{
			minIndex++;
			i = -1;
		}
		i++;
	}
	return minIndex;
}
function moveItem()
{
	selectTwoodleMove();
	for (var j = 0; j < 3; j++)
	{
		var auxTwoodleValues = [];
		var auxTwoodleValuesOrginal = [];
		var auxValue;
		for (var i = 0; i < twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]].length; i++)
		{
			if (twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]][i]['index'] == selectedItem)
			{
				if (ubication == 'top')
				{
					var n = nextIndex(auxTwoodleValues, twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]][i]['index']);
					auxTwoodleValues.push(JSON.parse(JSON.stringify(twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]][i])));
					if (selectedTwoodleIndex != selectedTwoodleMoveIndex)
					{
						auxTwoodleValues[auxTwoodleValues.length - 1]['index'] = n;
					}
				}
				else
				{
					auxValue = twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]][i];
				}
			}
			if (selectedTwoodleIndex != selectedTwoodleMoveIndex)
			{
				if (twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]][i]['index'] != selectedItem)
				{
					auxTwoodleValuesOrginal.push(JSON.parse(JSON.stringify(twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]][i])));
				}
			}
		}
		for (var i = 0; i < twoodles[selectedTwoodleMoveIndex][['yValues', 'xValues', 'items'][j]].length; i++)
		{
			if ((twoodles[selectedTwoodleMoveIndex][['yValues', 'xValues', 'items'][j]][i]['index'] != selectedItem) && (selectedTwoodleIndex == selectedTwoodleMoveIndex))
			{
				auxTwoodleValues.push(JSON.parse(JSON.stringify(twoodles[selectedTwoodleMoveIndex][['yValues', 'xValues', 'items'][j]][i])));
			}
			else
			{
				if (selectedTwoodleIndex != selectedTwoodleMoveIndex)
				{
					var n = nextIndex(auxTwoodleValues, twoodles[selectedTwoodleMoveIndex][['yValues', 'xValues', 'items'][j]][i]['index']);
					auxTwoodleValues.push(JSON.parse(JSON.stringify(twoodles[selectedTwoodleMoveIndex][['yValues', 'xValues', 'items'][j]][i])));
					auxTwoodleValues[auxTwoodleValues.length - 1]['index'] = n;
				}
			}
		}
		if (ubication == 'bottom')
		{
			var n = nextIndex(auxTwoodleValues, auxValue['index']);
			auxTwoodleValues.push(JSON.parse(JSON.stringify(auxValue)));
			if (selectedTwoodleIndex != selectedTwoodleMoveIndex)
			{
				auxTwoodleValues[auxTwoodleValues.length - 1]['index'] = n;
			}
		}
		twoodles[selectedTwoodleMoveIndex][['yValues', 'xValues', 'items'][j]] = [...auxTwoodleValues];
		auxTwoodleValues = [];

		if (selectedTwoodleIndex != selectedTwoodleMoveIndex)
		{
			twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]] = [...auxTwoodleValuesOrginal];
		}
		auxTwoodleValuesOrginal = [];
	}
	yValues = twoodles[selectedTwoodleIndex]['yValues'];
	xValues = twoodles[selectedTwoodleIndex]['xValues'];
	items = twoodles[selectedTwoodleIndex]['items'];
	fillItemsList();
	fillLists('y');
	fillLists('x');
	drawResult();
	displayLocalStorage('quadrants');
}
function preEditItem(id)
{
	document.getElementById('inputItemUrl').parentNode.style.display = 'block';
	selectedItem = id;
	for (var i = 0; i < twoodles[selectedTwoodleIndex]['items'].length; i++)
	{
		if (twoodles[selectedTwoodleIndex]['items'][i]['index'] == selectedItem)
		{
			if (!twoodles[selectedTwoodleIndex]['items'][i]['url'])
			{
				twoodles[selectedTwoodleIndex]['items'][i]['url'] = '';
			}
			if (!twoodles[selectedTwoodleIndex]['items'][i]['notes'])
			{
				twoodles[selectedTwoodleIndex]['items'][i]['notes'] = '';
			}
			document.getElementById('modalEditTitle').value = 'Edit "' + twoodles[selectedTwoodleIndex]['items'][i]['name'] + '"';
			document.getElementById('inputItemName').value = twoodles[selectedTwoodleIndex]['items'][i]['name'];
			document.getElementById('inputItemUrl').value = twoodles[selectedTwoodleIndex]['items'][i]['url'];
			document.getElementById('inputNotes').value = twoodles[selectedTwoodleIndex]['items'][i]['notes'];
		}
	}
	$('#modalEdit').modal('show');
}
function editItem()
{
	for (var i = 0; i < twoodles[selectedTwoodleIndex]['items'].length; i++)
	{
		if (twoodles[selectedTwoodleIndex]['items'][i]['index'] == selectedItem)
		{
			twoodles[selectedTwoodleIndex]['items'][i]['url'] = document.getElementById('inputItemUrl').value;
			twoodles[selectedTwoodleIndex]['items'][i]['notes'] = document.getElementById('inputNotes').value;
		}
	}
	document.getElementById('item_name_' + selectedItem).value = document.getElementById('inputItemName').value;
	flagShareUpdate = true;
	verifyItemsNames(false);
	if (validItemsNames)
	{
		items = twoodles[selectedTwoodleIndex]['items'];
		fillItemsList();
		fillLists('y', false);
		fillLists('x', false);
		saveValues();
		drawResult();
		displayLocalStorage('quadrants');
	}
}
function deleteItem(item)
{
	for (var j = 0; j < 3; j++)
	{
		var auxValues = [];
		for (var i = 0; i < twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]].length; i++)
		{
			if (twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]][i]['index'] != Number(item))
			{
				auxValues.push(JSON.parse(JSON.stringify(twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]][i])));
			}
		}
		twoodles[selectedTwoodleIndex][['yValues', 'xValues', 'items'][j]] = [...auxValues];
		auxValues = [];
	}

	items = twoodles[selectedTwoodleIndex]['items'];
	yValues = twoodles[selectedTwoodleIndex]['yValues'];
	xValues = twoodles[selectedTwoodleIndex]['xValues'];
	fillItemsList();
	fillLists('y');
	fillLists('x');
	drawResult();
	displayLocalStorage('quadrants');
}
function verifyItemsNames(shareUpdate = true)
{
	var repetidos = [];
	var auxItems = [];
	var c = document.getElementById('itemsList').children;
	for (var i = 0; i < c.length; i++)
	{
		auxItems.push([Number(c[i].id.split('_')[1]), document.getElementById('item_name_' + c[i].id.split('_')[1]).value]);
		document.getElementById('lblItem_' + c[i].id.split('_')[1]).innerHTML = '';
	}
	for (var i = 0; i < auxItems.length - 1; i++)
	{
		for (var j = i + 1; j < auxItems.length; j++)
		{
			if (auxItems[i][1] == auxItems[j][1])
			{
				repetidos.push(auxItems[i][0]);
				repetidos.push(auxItems[j][0]);
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
		var item = twoodles[selectedTwoodleIndex]['items'][0];
		for (var j = 1; j < twoodles[selectedTwoodleIndex]['items'].length; j++)
		{
			if (values[i]['index'] == twoodles[selectedTwoodleIndex]['items'][j]['index'])
			{
				item = twoodles[selectedTwoodleIndex]['items'][j];
			}
		}
		var linkHTML = '';
    	if (item['url'])
    	{
    		linkHTML = '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + item['url'] + '\', \'_blank\');"></i></div>';
    	}
		$("#" + axis + "ItemsList").append(`
			<div class="` + axis + `Item" id="` + axis + `_item_` + values[i]['index'] + `" class="rateListCard">
				<label class="itemName">` + n + `</label>
				<div class="btn-link trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(` + item['index'] + `);"></i></div>
				<div class="btn-link arrowIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(` + item['index'] + `);"></i></div>
				<div class="btn-link pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(` + item['index'] + `);"></i></div>` + 
				linkHTML
				 + `<label id="value_` + axis + `_item_` + values[i]['index'] + `" class="itemValue">` + values[i]['value'] + `</label>
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
			document.getElementById('recipeTitleresultsDiv').innerHTML = recipes[i]['recipeSubName'];

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
		document.getElementById('recipeTitleresultsDiv').innerHTML = 'Custom Recipe';
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
			var auxItems = twoodles[selectedTwoodleIndex]['items'];
			twoodles[selectedTwoodleIndex]['items'] = [];
			for (var i = 0; i < c.length; i++)
			{
				if (!auxItems[i])
				{
					auxItems[i] = {'url' : '', 'notes' : ''};
				}
				twoodles[selectedTwoodleIndex]['items'].push({
					'name' : document.getElementById('item_name_' + c[i].id.split('_')[1]).value, 
					'index' : Number(c[i].id.split('_')[1]), 
					'url' : auxItems[i]['url'], 
					'notes' : auxItems[i]['notes']
				});
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
function fillItemsList()
{
	document.getElementById('itemsList').innerHTML = '';
	if (items)
	{
		xValues = twoodles[selectedTwoodleIndex]['xValues'];
		yValues = twoodles[selectedTwoodleIndex]['yValues'];
		var html = {
			'NE' : [], 
			'NW' : [], 
			'SE' : [], 
			'SW' : []
		}
		for (var i = 0; i < items.length; i++)
        {
        	var linkHTML = '';
	    	if (items[i]['url'])
	    	{
	    		linkHTML = '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + items[i]['url'] + '\', \'_blank\');"></i></div>';
	    	}
	    	for (var j = 0; j < yValues.length; j++)
        	{
        		for (var k = 0; k < xValues.length; k++)
        		{
	                if ((yValues[j]['index'] == xValues[k]['index']) && (yValues[j]['value'] >= 50) && (xValues[k]['value'] >= 50) && (xValues[k]['index'] == items[i]['index']))
	                {
	                	html['NE'].push([`
							<div id="item_` + items[i]['index'] + `" onmouseup="getItems();" class="itemsListCard">
								<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `">
								<div class="btn-link trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(` + items[i]['index'] + `);"></i></div>
								<div class="btn-link arrowIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(` + items[i]['index'] + `);"></i></div>
								<div class="btn-link pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(` + items[i]['index'] + `);"></i></div>` + 
								linkHTML
								 + `<div><label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label></div>
							</div>`, (yValues[j]['value'] + xValues[k]['value'])]);
	                }
	        	}
            }
    	}
		for (var i = 0; i < items.length; i++)
        {
        	var linkHTML = '';
	    	if (items[i]['url'])
	    	{
	    		linkHTML = '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + items[i]['url'] + '\', \'_blank\');"></i></div>';
	    	}
	    	for (var j = 0; j < yValues.length; j++)
        	{
        		for (var k = 0; k < xValues.length; k++)
        		{
	                if ((yValues[j]['index'] == xValues[k]['index']) && (yValues[j]['value'] >= 50) && (xValues[k]['value'] < 50) && (yValues[j]['index'] == items[i]['index']))
					{
						html['NW'].push([`
							<div id="item_` + items[i]['index'] + `" onmouseup="getItems();" class="itemsListCard">
								<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `">
								<div class="btn-link trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(` + items[i]['index'] + `);"></i></div>
								<div class="btn-link arrowIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(` + items[i]['index'] + `);"></i></div>
								<div class="btn-link pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(` + items[i]['index'] + `);"></i></div>` + 
								linkHTML
								 + `<div><label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label></div>
							</div>`, (yValues[j]['value'] + xValues[k]['value'])]);
	                }
	        	}
            }
    	}
		for (var i = 0; i < items.length; i++)
        {
        	var linkHTML = '';
	    	if (items[i]['url'])
	    	{
	    		linkHTML = '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + items[i]['url'] + '\', \'_blank\');"></i></div>';
	    	}
	    	for (var j = 0; j < yValues.length; j++)
        	{
        		for (var k = 0; k < xValues.length; k++)
        		{
	                if ((yValues[j]['index'] == xValues[k]['index']) && (yValues[j]['value'] < 50) && (xValues[k]['value'] >= 50) && (xValues[k]['index'] == items[i]['index']))
					{
						html['SE'].push([`
							<div id="item_` + items[i]['index'] + `" onmouseup="getItems();" class="itemsListCard">
								<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `">
								<div class="btn-link trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(` + items[i]['index'] + `);"></i></div>
								<div class="btn-link arrowIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(` + items[i]['index'] + `);"></i></div>
								<div class="btn-link pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(` + items[i]['index'] + `);"></i></div>` + 
								linkHTML
								 + `<div><label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label></div>
							</(div>`, (yValues[j]['value'] + xValues[k]['value'])]);
					}
	        	}
            }
    	}
    	for (var i = 0; i < items.length; i++)
        {
        	var linkHTML = '';
	    	if (items[i]['url'])
	    	{
	    		linkHTML = '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + items[i]['url'] + '\', \'_blank\');"></i></div>';
	    	}
	    	for (var j = 0; j < yValues.length; j++)
        	{
        		for (var k = 0; k < xValues.length; k++)
        		{
	                if ((yValues[j]['index'] == xValues[k]['index']) && (yValues[j]['value'] < 50) && (xValues[k]['value'] < 50) && (yValues[j]['index'] == items[i]['index']))
            		{
	                	html['SW'].push([`
							<div id="item_` + items[i]['index'] + `" onmouseup="getItems();" class="itemsListCard">
								<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `">
								<div class="btn-link trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(` + items[i]['index'] + `);"></i></div>
								<div class="btn-link arrowIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(` + items[i]['index'] + `);"></i></div>
								<div class="btn-link pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(` + items[i]['index'] + `);"></i></div>` + 
								linkHTML
								 + `<div><label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label></div>
							</(div>`, (yValues[j]['value'] + xValues[k]['value'])]);
	                }
	        	}
            }
    	}
    	for (var j = 0; j < 4; j++)
    	{
	    	var i = 1;
	    	while (i < html[['NE', 'NW', 'SE', 'SW'][j]].length)
	    	{
	    		if (html[['NE', 'NW', 'SE', 'SW'][j]][i][1] > html[['NE', 'NW', 'SE', 'SW'][j]][i - 1][1])
	    		{
	    			var aux = [...html[['NE', 'NW', 'SE', 'SW'][j]][i]];
	    			html[['NE', 'NW', 'SE', 'SW'][j]][i] = [...html[['NE', 'NW', 'SE', 'SW'][j]][i - 1]];
	    			html[['NE', 'NW', 'SE', 'SW'][j]][i - 1] = [...aux];
	    			i = 0;
	    		}
	    		i++;
	    	}
    		for (i = 0; i < html[['NE', 'NW', 'SE', 'SW'][j]].length; i++)
        	{
				$("#itemsList").append(html[['NE', 'NW', 'SE', 'SW'][j]][i][0]);
        	}
    	}
	}
}