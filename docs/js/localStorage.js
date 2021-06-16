window.addEventListener('storage', () => {//Detecta cuando hay cambios en otra pestaña.
	var auxItems = JSON.parse(localStorage.getItem('items'));console.log(items.length, auxItems.length);
	if (items.length == auxItems.length)
	{
		var changed = false;
		for (var i = 0; i < items.length; i++)
	    {
	    	if ((auxItems[i]['index'] != items[i]['index']) || (auxItems[i]['name'] != items[i]['name']))
	    	{
	    		changed = true;
	    	}
	    }
	    var valuesChanged = false;
	    for (var i = 0; i < items.length; i++)
    	{
    		for (var j = 0; j < auxItems.length; j++)
    		{
    			if ((auxItems[j]['index'] == items[i]['index']) && 
    				(
    					(auxItems[j]['xValue'] != items[i]['xValue']) || 
    					(auxItems[j]['yValue'] != items[i]['yValue'])
    				)
    			)
		    	{
		    		valuesChanged = true;
		    	}
    		}
    	}
	    if (changed)
	    {
			items = auxItems;
			document.getElementById('itemsList').innerHTML = '';
			for (var i = 0; i < items.length; i++)
		    {
		    	$("#itemsList").append(`
					<div id="item_` + i + `" onmouseup="getItems();">
						<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
						<button class="deleteItemButton" id="` + items[i]['index'] + `" onclick="deleteItem(this.id);">Delete</button>
						<label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label>
					</div>`
				);
		    }
	    }
		if (document.getElementById("seeDiv").style.display == "block")
		{//console.log(changed, valuesChanged);
			if (changed || valuesChanged)
			{
				items = auxItems;
				fillLists('y');
				fillLists('x');
				drawResult();
			}
		}
		if ((document.getElementById("rateYDiv").style.display == "block") || (document.getElementById("rateXDiv").style.display == "block"))
		{console.log();
			if (changed)
			{
				fillLists('y');
				fillLists('x');
			}
			else
			{console.log();//Ver si cambiaron valores.
    			//var c = document.getElementById('yDivRange').getElementsByClassName('input');
    			//var c2 = document.getElementById('xItemsList').getElementsByClassName('input');
				for (var i = 0; i < auxItems.length; i++)
	    		{
	    			document.getElementById('range_y_item_' + auxItems[i]['index']).value = auxItems[i]['yValue'];
	    			document.getElementById('range_x_item_' + auxItems[i]['index']).value = auxItems[i]['xValue'];
	    			getValues();
	    			/*for (var j = 0; j < c.length; j++)
	    			{//range_` + axis + `_item_` + auxValues[i][1]
	    				if (Number(c[j].id.split('_')[3]) == auxItems[i]['index'])
	    				{
	    					c[j].value = auxItems[i]['yValue'];
	    				}
	    			}
	    			for (var j = 0; j < c2.length; j++)
	    			{
	    				if (Number(c2[j].id.split('_')[3]) == auxItems[i]['index'])
	    				{
	    					c2[j].value = auxItems[i]['xValue'];
	    				}
	    			}*/
	    		}
			}
		}
		var difNames = false;
		for (var i = 0; i < items.length; i++)
		{
			//
		}
	}
	else
	{
		if (document.getElementById("createDiv").style.display == "block")
		{
			items = auxItems;
			document.getElementById('itemsList').innerHTML = '';
			for (var i = 0; i < items.length; i++)
		    {
		    	$("#itemsList").append(`
					<div id="item_` + i + `" onmouseup="getItems();">
						<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
						<button class="deleteItemButton" id="` + items[i]['index'] + `" onclick="deleteItem(this.id);">Delete</button>
						<label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label>
					</div>`
				);
		    }
		}
	}
	/*var changed = false;
	var auxNamesMaster = JSON.parse(localStorage.getItem('namesMaster'));
	for (var i = 0; i < namesMaster.length; i++)
	{
		if (namesMaster[i] != auxNamesMaster[i])
		{
			namesMaster = auxNamesMaster;
			document.getElementById('itemsList').innerHTML = '';
			for (var j = 0; j < namesMaster.length; j++)
			{
				$("#itemsList").append(`
					<div id="item_` + i + `">
						<input class="itemName" type="text" value="` + namesMaster[i] + `" id="item_name_` + i + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));saveNames();" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
						<button class="deleteItemButton" id="` + i + `" onclick="deleteItem(this.id);">Delete</button>
						<label class="lblRepeatedItem" id="lblItem_` + i + `"></label>
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
	if (!yValues)
	{
		getValues();
	}
	var changed2 = false;
	var auxItemsOrder = JSON.parse(localStorage.getItem('itemsOrder'));
	for (var i = 0; i < auxItemsOrder.length; i++)
	{
		if ((yValues[i] != yValues[auxItemsOrder[i]]) || changed2)
		{
			var auxxValues = [];
			var auxyValues = [];
			itemsOrder = JSON.parse(localStorage.getItem('itemsOrder'));
			for (var j = 0; j < itemsOrder.length; j++)
			{
				auxyValues.push(yValues[itemsOrder[j]]);
				auxxValues.push(xValues[itemsOrder[j]]);
			}
			xValues = auxxValues;
			yValues = auxyValues;
			fillLists('x');
			fillLists('y');
			changed = true;
			changed2 = true;
		}
	}
	var auxYValues = JSON.parse(localStorage.getItem('yValues'));
	for (var i = 0; i < yValues.length; i++)
	{
		if (yValues[i] != auxYValues[i])
		{
			yValues = auxYValues;
			getNames();
			getPreviousIdsOrder();
			fillLists('x');
			fillLists('y');
			changed = true;
			i = yValues.length;
		}
	}
	var auxXValues = JSON.parse(localStorage.getItem('xValues'));
	for (var i = 0; i < xValues.length; i++)
	{
		if (xValues[i] != auxXValues[i])
		{
			xValues = auxXValues;
			getNames();
			getPreviousIdsOrder();
			fillLists('y');
			fillLists('x');
			changed = true;
			i = xValues.length;
		}
	}*/
	var auxXAxisName = JSON.parse(localStorage.getItem('xAxisName'));
	if (auxXAxisName != xAxisName)
	{
		xAxisName = auxXAxisName;
		document.getElementById('xAxis_name').value = xAxisName;
		changed = true;
	}
	var auxYAxisName = JSON.parse(localStorage.getItem('yAxisName'));
	if (auxYAxisName != yAxisName)
	{
		yAxisName = auxYAxisName;
		document.getElementById('yAxis_name').value = yAxisName;
		changed = true;
	}
	/*if (changed && (document.getElementById("seeDiv").style.display == "block"))
	{
		fillAxisNames();
		getValues();
		getPreviousIdsOrder();
		drawResult();
	}*/
});
//function saveNames()
function saveItems()
{
	if (validItemsNames && validAxisNames)
	{
		getNames();
		getValues();
		//getPreviousIdsOrder();//Pendiente ver si es necesario.
		/*var itemsOrder = [];
		var c = document.getElementById('itemsList').children;
		for (var i = 0; i < c.length; i++)
		{
			itemsOrder.push(Number(c[i].id.split('_')[1]));
		}*/
		//localStorage.setItem('namesMaster', JSON.stringify(namesMaster));
		localStorage.setItem('items', JSON.stringify(items));
		//localStorage.setItem('itemsOrder', JSON.stringify(itemsOrder));
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
	//getPreviousIdsOrder();
	getValues();
	localStorage.setItem('xValues', JSON.stringify(xValues));
	localStorage.setItem('yValues', JSON.stringify(yValues));
}
function loadValues()
{
	//if ((JSON.parse(localStorage.getItem('namesMaster'))) && (JSON.parse(localStorage.getItem('namesMaster')).length))
	if ((JSON.parse(localStorage.getItem('items'))) && (JSON.parse(localStorage.getItem('items')).length))
	{
		items = JSON.parse(localStorage.getItem('items'));
		document.getElementById('itemsList').innerHTML = '';
		for (var i = 0; i < items.length; i++)
	    {
	    	$("#itemsList").append(`
				<div id="item_` + i + `" onmouseup="getItems();">
					<input class="itemName" type="text" value="` + items[i]['name'] + `" id="item_name_` + items[i]['index'] + `" onmouseup="itemsListSortable.removeContainer(document.getElementById('itemsList'));" onmouseleave="itemsListSortable.addContainer(document.getElementById('itemsList'));">
					<button class="deleteItemButton" id="` + items[i]['index'] + `" onclick="deleteItem(this.id);">Delete</button>
					<label class="lblRepeatedItem" id="lblItem_` + items[i]['index'] + `"></label>
				</div>`
			);
	    }
	    fillLists('y');
	    fillLists('x');
	    /*if (localStorage.getItem('yValues'))
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
	    }*/
    	if (localStorage.getItem('yAxisName') && localStorage.getItem('xAxisName') && (localStorage.getItem('yAxisName') != localStorage.getItem('xAxisName')))
		{
			xAxisName = JSON.parse(localStorage.getItem('xAxisName'));
			yAxisName = JSON.parse(localStorage.getItem('yAxisName'));
			document.getElementById('yAxis_name').value = yAxisName;
			document.getElementById('xAxis_name').value = xAxisName;
		}
	}
	verifyAxisNames();
}