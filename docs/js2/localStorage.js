window.addEventListener('storage', () => {//Detecta cuando hay cambios en otra pestaña.
	var changed = false;
	var auxItems = JSON.parse(localStorage.getItem('items2'));
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

	var auxYValues = JSON.parse(localStorage.getItem('yValues2'));
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
	var auxXValues = JSON.parse(localStorage.getItem('xValues2'));
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
	auxXAxisName = JSON.parse(localStorage.getItem('xAxisName2'));
	if (auxXAxisName != xAxisName)
	{
		xAxisName = auxXAxisName;
		document.getElementById('xAxis_name').value = xAxisName;
		changed = true;
	}
	auxYAxisName = JSON.parse(localStorage.getItem('yAxisName2'));
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
		localStorage.setItem('xAxisName2', JSON.stringify(document.getElementById('xAxis_name').value));
		localStorage.setItem('yAxisName2', JSON.stringify(document.getElementById('yAxis_name').value));
	}
}
function saveValues()
{
	localStorage.setItem('xValues2', JSON.stringify(xValues));
	localStorage.setItem('yValues2', JSON.stringify(yValues));
}
function loadValues()
{
	if ((JSON.parse(localStorage.getItem('items2'))) && (JSON.parse(localStorage.getItem('items2')).length))
	{
		items = JSON.parse(localStorage.getItem('items2'));
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
	    if (localStorage.getItem('yAxisName2') && localStorage.getItem('xAxisName2') && (localStorage.getItem('yAxisName2') != localStorage.getItem('xAxisName2')))
		{
			xAxisName = JSON.parse(localStorage.getItem('xAxisName2'));
			yAxisName = JSON.parse(localStorage.getItem('yAxisName2'));
			document.getElementById('yAxis_name').value = yAxisName;
			document.getElementById('xAxis_name').value = xAxisName;
		}
	    if (localStorage.getItem('yValues2'))
	    {
			xValues = JSON.parse(localStorage.getItem('xValues2'));
			yValues = JSON.parse(localStorage.getItem('yValues2'));
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