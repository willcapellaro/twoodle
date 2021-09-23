window.addEventListener('storage', () => {//Detecta cuando hay cambios en otra pestaña.
	var changed = false;
	var auxItems = JSON.parse(localStorage.getItem('items'));
	if (items.length != auxItems.length)
	{
		//items = auxItems;
		loadValues();
	}
	else
	{
		for (var i = 0; i < items.length; i++)
		{
			if ((items[i]['name'] != auxItems[i]['name']) || (items[i]['index'] != auxItems[i]['index']))
			{
				items = auxItems;
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
				fillLists('x');
				fillLists('y');
				changed = true;
				i = items.length;
			}
		}
	}

	var auxYValues = JSON.parse(localStorage.getItem('yValues'));
	if (yValues.length != auxYValues.length)
	{
		yValues = auxYValues;
		fillLists('y');
		changed = true;
	}
	else
	{
		for (var i = 0; i < yValues.length; i++)
		{
			if ((yValues[i]['name'] != auxYValues[i]['name']) || (yValues[i]['index'] != auxYValues[i]['index']))
			{
				yValues = auxYValues;
				fillLists('y');
				changed = true;
				i = yValues.length;
			}
		}
	}
	var auxXValues = JSON.parse(localStorage.getItem('xValues'));
	if (xValues.length != auxXValues.length)
	{
		xValues = auxXValues;
		fillLists('x');
		changed = true;
	}
	else
	{
		for (var i = 0; i < xValues.length; i++)
		{
			if ((xValues[i]['value'] != auxXValues[i]['value']) || (xValues[i]['index'] != auxXValues[i]['index']))
			{
				xValues = auxXValues;
				fillLists('x');
				changed = true;
				i = xValues.length;
			}
		}
	}
	auxXAxisName = JSON.parse(localStorage.getItem('xAxisName'));
	if (auxXAxisName != xAxisName)
	{
		xAxisName = auxXAxisName;
		document.getElementById('xAxis_name').value = xAxisName;
		changed = true;
	}
	auxYAxisName = JSON.parse(localStorage.getItem('yAxisName'));
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
});
function saveAxisNames()
{
	if (document.getElementById('yAxis_name').value != document.getElementById('xAxis_name').value)
	{
		localStorage.setItem('xAxisName', JSON.stringify(document.getElementById('xAxis_name').value));
		localStorage.setItem('yAxisName', JSON.stringify(document.getElementById('yAxis_name').value));
	}
}
function saveValues()
{
	localStorage.setItem('xValues', JSON.stringify(xValues));
	localStorage.setItem('yValues', JSON.stringify(yValues));
	localStorage.setItem('items', JSON.stringify(items));
}
function loadValues()
{
	if ((JSON.parse(localStorage.getItem('items'))) && (JSON.parse(localStorage.getItem('items')).length))
	{
		items = JSON.parse(localStorage.getItem('items'));
		document.getElementById('itemsList').innerHTML = '';
		for (var i = 0; i < items.length; i++)
	    {
	    	$("#itemsList").append(`
				<div id="item_` + items[i]['index'] + `" onmouseup="getItems();">
					<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
					<button class="deleteItemButton" id="` + items[i]['index'] + `" onclick="deleteItem(this.id);">Delete</button>
					<label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label>
				</div>`
			);
	    }
	    if (localStorage.getItem('yAxisName') && localStorage.getItem('xAxisName') && (localStorage.getItem('yAxisName') != localStorage.getItem('xAxisName')))
		{
			xAxisName = JSON.parse(localStorage.getItem('xAxisName'));
			yAxisName = JSON.parse(localStorage.getItem('yAxisName'));
			document.getElementById('yAxis_name').value = yAxisName;
			document.getElementById('xAxis_name').value = xAxisName;
		}
	    if (localStorage.getItem('yValues'))
	    {
			xValues = JSON.parse(localStorage.getItem('xValues'));
			yValues = JSON.parse(localStorage.getItem('yValues'));
			if (yValues.length)
			{
				saveValues();
			}
	    }
	    else
	    {
	    	for (var i = 0; i < items.length; i++)
	    	{
	    		yValues.push({'value' : 0, 'index' : items[i]['index']});
	    		xValues.push({'value' : 0, 'index' : items[i]['index']});
	    	}
	    	saveValues();
	    }
	}
	verifyAxisNames();
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
function displayLocalStorage()
{//2b) Action that opens a text-only display of local storage
	var localStorageText = 'Empty.';
	if (localStorage.getItem('xValues') || localStorage.getItem('yValues'))
	{
		localStorageText = 'xAxisName: ' + JSON.parse(localStorage.getItem('xAxisName')) + '<br>';
		localStorageText += 'yAxisName: ' + JSON.parse(localStorage.getItem('yAxisName')) + '<br><br>';

		if ((localStorage.getItem('items')) && (JSON.parse(localStorage.getItem('items')).length))
		{
			aux = JSON.parse(localStorage.getItem('items'));
			localStorageText += 'items:<br>';
			for (var i = 0; i < aux.length; i++)
	    	{
	    		localStorageText += 'name: ' + aux[i]['name'] + ', index: ' + aux[i]['index'] + '<br>';
	    	}
	    	localStorageText += '<br>';
		}
		
		if ((localStorage.getItem('xValues')) && (JSON.parse(localStorage.getItem('xValues')).length))
		{
			var aux = JSON.parse(localStorage.getItem('xValues'));
			localStorageText += 'xValues:<br>';
			for (var i = 0; i < aux.length; i++)
	    	{
	    		localStorageText += 'value: ' + aux[i]['value'] + ', index: ' + aux[i]['index'] + '<br>';
	    	}
	    	localStorageText += '<br>';
		}

		if ((localStorage.getItem('yValues')) && (JSON.parse(localStorage.getItem('yValues')).length))
		{
			aux = JSON.parse(localStorage.getItem('yValues'));
			localStorageText += 'yValues:<br>';
			for (var i = 0; i < aux.length; i++)
	    	{
	    		localStorageText += 'value: ' + aux[i]['value'] + ', index: ' + aux[i]['index'] + '<br>';
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
	saveAxisNames();
	verifyItemsNames();

	fillLists('x');
	fillLists('y');

	if (document.getElementById("seeDiv").style.display == "block")
	{
		menuItemClicked('see');
	}
}