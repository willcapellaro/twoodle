function saveNames()
{
	if (validItemsNames && validAxisNames)
	{
		getNames();
		getPreviousIdsOrder();
		var itemsOrder = [];
		var c = document.getElementById('itemsList').children;
		for (var i = 0; i < c.length; i++)
		{
			itemsOrder.push(Number(c[i].id.split('_')[1]));
		}
		localStorage.setItem('namesMaster', JSON.stringify(namesMaster));
		localStorage.setItem('itemsOrder', JSON.stringify(itemsOrder));
	}
}
function saveAxisNames()
{
	if (document.getElementById('yAxis_name').value != document.getElementById('xAxis_name').value)
	{
		localStorage.setItem('xAxisName', JSON.stringify(document.getElementById('xAxis_name').value));
		localStorage.setItem('yAxisName', JSON.stringify(document.getElementById('yAxis_name').value));
	}
}
function saveAxisValues(axis)
{
	getPreviousIdsOrder();
	getValues();
	localStorage.setItem('xValues', JSON.stringify(xValues));
	localStorage.setItem('yValues', JSON.stringify(yValues));
}
function loadValues()
{
	if ((JSON.parse(localStorage.getItem('namesMaster'))) && (JSON.parse(localStorage.getItem('namesMaster')).length))
	{
		namesMaster = JSON.parse(localStorage.getItem('namesMaster'));
		
		document.getElementById('itemsList').innerHTML = '';
		for (var i = 0; i < namesMaster.length; i++)
	    {
	    	$("#itemsList").append(`
				<div id="item_` + i + `">
					<input class="itemName" type="text" value="` + namesMaster[i] + `" id="item_name_` + i + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));saveNames();" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
					<button class="deleteItemButton" id="` + i + `" onclick="deleteItem(this.id);">Delete</button>
					<label class="lblRepeatedItem" id="lblItem_` + i + `"></label>
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
			if (localStorage.getItem('itemsOrder'))
			{
				var auxxValues = [];
				var auxyValues = [];
				var itemsOrder = JSON.parse(localStorage.getItem('itemsOrder'));
				for (var i = 0; i < itemsOrder.length; i++)
				{
					auxyValues.push(yValues[itemsOrder[i]]);
					auxxValues.push(xValues[itemsOrder[i]]);
				}
				xValues = auxxValues;
				yValues = auxyValues;
			}
			if (yValues.length)
			{
				getNames();
				getPreviousIdsOrder();
				fillLists('y');
				fillLists('x');
			}
	    }
	}
	verifyAxisNames();
}