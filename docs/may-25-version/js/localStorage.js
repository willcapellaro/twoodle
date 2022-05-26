var userID;
var flagShareUpdate = true;
var selectedTab = 'readable';
window.addEventListener('storage', () => {//Detecta cuando hay cambios en otra pestaña.
	var changed = false;
	var auxItems = JSON.parse(localStorage.getItem('data'))['items'];
	var auxYValues = JSON.parse(localStorage.getItem('data'))['yValues'];
	var auxXValues = JSON.parse(localStorage.getItem('data'))['xValues'];
	if (auxItems == null)
	{
		auxItems = [];
	}
	if (auxYValues == null)
	{
		auxYValues = [];
	}
	if (auxXValues == null)
	{
		auxXValues = [];
	}
	
	if (items.length != auxItems.length)
	{
		loadValues();
		yValues = auxYValues;
		xValues = auxXValues;
		fillLists('x', false);
		fillLists('y', false);
		changed = true;
	}
	else
	{
		for (var i = 0; i < items.length; i++)
		{
			if ((items[i]['name'] != auxItems[i]['name']) || (items[i]['index'] != auxItems[i]['index']))
			{
				items = auxItems;
				flagShareUpdate = false;
				document.getElementById('itemsList').innerHTML = '';
				for (var j = 0; j < items.length; j++)
				{
					$("#itemsList").append(`
						<div id="item_` + items[j]['index'] + `" onmouseup="getItems();">
							<input class="itemName" type="text" value="` + items[j]['name'] + `" id="item_name_` + items[j]['index'] + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
							<button class="deleteItemButton" id="` + items[j]['index'] + `" onclick="deleteItem(this.id);">Delete</button>
							<label class="lblRepeatedItem" id="lblItem_` + items[j]['index'] + `"></label>
						</div>`
					);
				}
				yValues = auxYValues;
				xValues = auxXValues;
				fillLists('x', false);
				fillLists('y', false);
				changed = true;
				i = items.length;
			}
		}
	}
	
	if (yValues.length != auxYValues.length)
	{
		yValues = auxYValues;
		fillLists('y', false);
		changed = true;
	}
	else
	{
		for (var i = 0; i < yValues.length; i++)
		{
			if ((yValues[i]['name'] != auxYValues[i]['name']) || (yValues[i]['index'] != auxYValues[i]['index']))
			{
				yValues = auxYValues;
				fillLists('y', false);
				changed = true;
				i = yValues.length;
			}
		}
	}
	if (xValues.length != auxXValues.length)
	{
		xValues = auxXValues;
		fillLists('x', false);
		changed = true;
	}
	else
	{
		for (var i = 0; i < xValues.length; i++)
		{
			if ((xValues[i]['value'] != auxXValues[i]['value']) || (xValues[i]['index'] != auxXValues[i]['index']))
			{
				xValues = auxXValues;
				fillLists('x', false);
				changed = true;
				i = xValues.length;
			}
		}
	}
	
	flagShareUpdate = true;
	auxXAxisName = localStorage.getItem('xAxisName');
	if (auxXAxisName != xAxisName)
	{
		xAxisName = auxXAxisName;
		document.getElementById('xAxis_name').value = xAxisName;
		changed = true;
	}
	auxYAxisName = localStorage.getItem('yAxisName');
	if (auxYAxisName != yAxisName)
	{
		yAxisName = auxYAxisName;
		document.getElementById('yAxis_name').value = yAxisName;
		changed = true;
	}
	if (changed && (document.getElementById("seeDiv").style.display == "block"))
	{
		fillAxisNames();
		drawResult();
	}
	displayLocalStorage(selectedTab);
});
function saveAxisNames()
{
	if (document.getElementById('yAxis_name').value != document.getElementById('xAxis_name').value)
	{
		localStorage.setItem('xAxisName', document.getElementById('xAxis_name').value);
		localStorage.setItem('yAxisName', document.getElementById('yAxis_name').value);
	}
}
function saveValues()
{
	saveAxisNames();
	localStorage.setItem('data', JSON.stringify({'xValues': xValues, 'yValues': yValues, 'items': items}));
}
function loadValues()
{
	if (JSON.parse(localStorage.getItem('data')))
	{
		if (JSON.parse(localStorage.getItem('data'))['items'])
		{
			items = JSON.parse(localStorage.getItem('data'))['items'];
		}
		else
		{
			items = [];
		}
	}
	else
	{
		items = [];
	}
	
	flagShareUpdate = false;
	document.getElementById('itemsList').innerHTML = '';
	for (var i = 0; i < items.length; i++)
    {
    	$("#itemsList").append(`
			<div id="item_` + items[i]['index'] + `" onmouseup="getItems();">
				<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
				<button class="deleteItemButton" id="` + items[i]['index'] + `" onclick="deleteItem(this.id);"><i class="fas fa-trash"></i></button>
				<label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label>
			</div>`
		);
    }
    if (localStorage.getItem('yAxisName') && localStorage.getItem('xAxisName') && (localStorage.getItem('yAxisName') != localStorage.getItem('xAxisName')))
	{
		xAxisName = localStorage.getItem('xAxisName');
		yAxisName = localStorage.getItem('yAxisName');
		document.getElementById('yAxis_name').value = yAxisName;
		document.getElementById('xAxis_name').value = xAxisName;
	}
	else
	{
		if (!xAxisName || !yAxisName)
		{
			yAxisName = document.getElementById('yAxis_name').value;
			xAxisName = document.getElementById('xAxis_name').value;
		}
	}
    if (JSON.parse(localStorage.getItem('data')) && JSON.parse(localStorage.getItem('data'))['yValues'])
    {
		xValues = JSON.parse(localStorage.getItem('data'))['xValues'];
		yValues = JSON.parse(localStorage.getItem('data'))['yValues'];
    }
    else
    {
    	for (var i = 0; i < items.length; i++)
    	{
    		yValues.push({'value' : 0, 'index' : items[i]['index']});
    		xValues.push({'value' : 0, 'index' : items[i]['index']});
    	}
    }
	flagShareUpdate = true;
}
function localStorageSelected(selectedIndex)
{
	if (selectedIndex)
	{
		displayLocalStorage();
	}
	else
	{
		clearValues();
	}
}
function displayLocalStorage(tab = 'readable')
{//2b) Action that opens a text-only display of local storage
	selectedTab = tab;
	var localStorageText = 'Empty.';
	if ((JSON.parse(localStorage.getItem('data'))) && (JSON.parse(localStorage.getItem('data'))['xValues'] || JSON.parse(localStorage.getItem('data'))['yValues']))
	{
		if (tab == 'readable')
		{
			localStorageText = 'Highest to Lowest ' + localStorage.getItem('xAxisName') + '<br><br>';
			for (var i = 0; i < xValues.length; i++)
			{
				for (var j = 0; j < items.length; j++)
				{
					if (xValues[i]['index'] == items[j]['index'])
					{
						localStorageText += items[j]['name'] + '<br>';
					}
				}
			}
			localStorageText += '<br>Highest to Lowest ' + localStorage.getItem('yAxisName') + '<br><br>';
			for (var i = 0; i < yValues.length; i++)
			{
				for (var j = 0; j < items.length; j++)
				{
					if (yValues[i]['index'] == items[j]['index'])
					{
						localStorageText += items[j]['name'] + '<br>';
					}
				}
			}
		}
		if (tab == 'code')
		{
			localStorageText = 'xAxisName: ' + localStorage.getItem('xAxisName') + '<br>';
			localStorageText += 'yAxisName: ' + localStorage.getItem('yAxisName') + '<br><br>';

			if (JSON.parse(localStorage.getItem('data'))['items'] && JSON.parse(localStorage.getItem('data'))['items'].length)
			{
				aux = JSON.parse(localStorage.getItem('data'))['items'];
				localStorageText += 'items:<br>';
				for (var i = 0; i < aux.length; i++)
		    	{
		    		localStorageText += 'name: ' + aux[i]['name'] + ', index: ' + aux[i]['index'] + '<br>';
		    	}
		    	localStorageText += '<br>';
			}
			
			if (JSON.parse(localStorage.getItem('data'))['xValues'] && JSON.parse(localStorage.getItem('data'))['xValues'].length)
			{
				var aux = JSON.parse(localStorage.getItem('data'))['xValues'];
				localStorageText += 'xValues:<br>';
				for (var i = 0; i < aux.length; i++)
		    	{
		    		localStorageText += 'value: ' + aux[i]['value'] + ', index: ' + aux[i]['index'] + '<br>';
		    	}
		    	localStorageText += '<br>';
			}

			if (JSON.parse(localStorage.getItem('data'))['yValues'] && JSON.parse(localStorage.getItem('data'))['yValues'].length)
			{
				aux = JSON.parse(localStorage.getItem('data'))['yValues'];
				localStorageText += 'yValues:<br>';
				for (var i = 0; i < aux.length; i++)
		    	{
		    		localStorageText += 'value: ' + aux[i]['value'] + ', index: ' + aux[i]['index'] + '<br>';
		    	}
			}
		}
	}
	document.getElementById('localStorageContents').innerHTML = localStorageText;
}
function clearValues()
{//2a) “Clear Local Storage” action
	document.getElementById('modalClear').style.display = 'none';
	yValues = [];
	xValues = [];
	idsOrder = [];
	itemMoved = -1;
	validItemsNames = true;
	validAxisNames = true;
	items = [];

	document.getElementById('yAxis_name').value = 'importance';
	document.getElementById('xAxis_name').value = 'urgency';
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;
	document.getElementById('itemsList').innerHTML = '';
	saveValues();
	if (document.getElementById("seeDiv").style.display == "block")
	{
		menuItemClicked('see');
	}
}
function swap()
{
	document.getElementById('yAxis_name').value = document.getElementById('xAxis_name').value;
	document.getElementById('xAxis_name').value = yAxisName;
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;

	for (var i = 0; i < xValues.length; i++)
	{
		var auxValue = xValues[i];
		for (var j = 0; j < yValues.length; j++)
		{
			if (xValues[i]['index'] == yValues[j]['index'])
			{
				xValues[i] = yValues[j];
				yValues[j] = auxValue;
			}
		}
	}
	var changes = true;
	while (changes)
	{
		changes = false;
		for (var i = 0; i < xValues.length - 1; i++)
		{
			if (xValues[i]['value'] < xValues[i + 1]['value'])
			{
				var auxValue = xValues[i];
				xValues[i] = xValues[i + 1];
				xValues[i + 1] = auxValue;
				changes = true;
			}
		}
	}
	changes = true;
	while (changes)
	{
		changes = false;
		for (var i = 0; i < yValues.length - 1; i++)
		{
			if (yValues[i]['value'] < yValues[i + 1]['value'])
			{
				var auxValue = yValues[i];
				yValues[i] = yValues[i + 1];
				yValues[i + 1] = auxValue;
				changes = true;
			}
		}
	}
	saveValues();
}
function recipe1(yPlug,xPlug)
{
	document.getElementById('yAxis_name').value = yPlug;
	document.getElementById('xAxis_name').value = xPlug;
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;


	for (var i = 0; i < xValues.length; i++)
	{
		var auxValue = xValues[i];
		for (var j = 0; j < yValues.length; j++)
		{
			if (xValues[i]['index'] == yValues[j]['index'])
			{
				xValues[i] = yValues[j];
				yValues[j] = auxValue;
			}
		}
	}
	var changes = true;
	while (changes)
	{
		changes = false;
		for (var i = 0; i < xValues.length - 1; i++)
		{
			if (xValues[i]['value'] < xValues[i + 1]['value'])
			{
				var auxValue = xValues[i];
				xValues[i] = xValues[i + 1];
				xValues[i + 1] = auxValue;
				changes = true;
			}
		}
	}
	changes = true;
	while (changes)
	{
		changes = false;
		for (var i = 0; i < yValues.length - 1; i++)
		{
			if (yValues[i]['value'] < yValues[i + 1]['value'])
			{
				var auxValue = yValues[i];
				yValues[i] = yValues[i + 1];
				yValues[i + 1] = auxValue;
				changes = true;
			}
		}
	}
	saveValues();
}