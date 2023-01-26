var auxYAxisName = 'Y Axis';
var auxXAxisName = 'X Axis';
var selectedTwoodleIndex = 0;
function changeSelectedTwoodleIndex()
{
	for (var i = 0; i < twoodles.length; i++)
	{
		if (twoodles[i]['index'] == selectedTwoodle)
		{
			selectedTwoodleIndex = i;
		}
	}
}
function displayNewTwoodleMenu()
{
	$('#modalNewTwoodle').modal('show');
	if (document.getElementById('mr').checked)
	{
		var html = '<select id="slcRecipe" onchange="">';
		for (var i = 0; i < recipes.length; i++)
		{
			html += '<option id="optSlcRecipe_' + recipes[i]['id'] + '">' + recipes[i]['defaultY'] + '/' + recipes[i]['defaultX'] + '</option>';
		}
		html += '</select>';
		document.getElementById('matrixInput').innerHTML = html;
	}
	else
	{
		document.getElementById('matrixInput').innerHTML = '<input class="inputAxisNewTwoodle" type="text" id="inputYAxisName" value="' + auxYAxisName + '"><input class="inputAxisNewTwoodle" type="text" id="inputXAxisName" value="' + auxXAxisName + '"><div id="divDuplicatedErrorTwoodle"></div>';
	}
}
function displayRenameTwoodleModal()
{
	$('#modalRenameTwoodle').modal('show');
	for (var i = 0; i < twoodles.length; i++)
	{
		if (twoodles[i]['index'] == selectedTwoodle)
		{
			document.getElementById('inputRenameTwoodleName').value = twoodles[i]['name'];
		}
	}
}
function quadrantsOrder(itemsToOrderIndex)
{
	var auxItems = [];
	for (var i = 0; i < twoodles[itemsToOrderIndex]['items'].length; i++)
    {
    	for (var j = 0; j < twoodles[itemsToOrderIndex]['yValues'].length; j++)
    	{
    		for (var k = 0; k < twoodles[itemsToOrderIndex]['xValues'].length; k++)
    		{
                if ((twoodles[itemsToOrderIndex]['yValues'][j]['index'] == twoodles[itemsToOrderIndex]['xValues'][k]['index']) && (twoodles[itemsToOrderIndex]['yValues'][j]['value'] >= 50) && (twoodles[itemsToOrderIndex]['xValues'][k]['value'] >= 50) && (twoodles[itemsToOrderIndex]['xValues'][k]['index'] == twoodles[itemsToOrderIndex]['items'][i]['index']))
                {
                	auxItems.push(twoodles[itemsToOrderIndex]['items'][i]);
                }
        	}
        }
	}
	for (var i = 0; i < twoodles[itemsToOrderIndex]['items'].length; i++)
    {
    	for (var j = 0; j < twoodles[itemsToOrderIndex]['yValues'].length; j++)
    	{
    		for (var k = 0; k < twoodles[itemsToOrderIndex]['xValues'].length; k++)
    		{
                if ((twoodles[itemsToOrderIndex]['yValues'][j]['index'] == twoodles[itemsToOrderIndex]['xValues'][k]['index']) && (twoodles[itemsToOrderIndex]['yValues'][j]['value'] >= 50) && (twoodles[itemsToOrderIndex]['xValues'][k]['value'] < 50) && (twoodles[itemsToOrderIndex]['yValues'][j]['index'] == twoodles[itemsToOrderIndex]['items'][i]['index']))
				{
					auxItems.push(twoodles[itemsToOrderIndex]['items'][i]);
                }
        	}
        }
	}
	for (var i = 0; i < twoodles[itemsToOrderIndex]['items'].length; i++)
    {
    	for (var j = 0; j < twoodles[itemsToOrderIndex]['yValues'].length; j++)
    	{
    		for (var k = 0; k < twoodles[itemsToOrderIndex]['xValues'].length; k++)
    		{
                if ((twoodles[itemsToOrderIndex]['yValues'][j]['index'] == twoodles[itemsToOrderIndex]['xValues'][k]['index']) && (twoodles[itemsToOrderIndex]['yValues'][j]['value'] < 50) && (twoodles[itemsToOrderIndex]['xValues'][k]['value'] >= 50) && (twoodles[itemsToOrderIndex]['xValues'][k]['index'] == twoodles[itemsToOrderIndex]['items'][i]['index']))
				{
					auxItems.push(twoodles[itemsToOrderIndex]['items'][i]);
				}
        	}
        }
	}
	for (var i = 0; i < twoodles[itemsToOrderIndex]['items'].length; i++)
    {
    	for (var j = 0; j < twoodles[itemsToOrderIndex]['yValues'].length; j++)
    	{
    		for (var k = 0; k < twoodles[itemsToOrderIndex]['xValues'].length; k++)
    		{
                if ((twoodles[itemsToOrderIndex]['yValues'][j]['index'] == twoodles[itemsToOrderIndex]['xValues'][k]['index']) && (twoodles[itemsToOrderIndex]['yValues'][j]['value'] < 50) && (twoodles[itemsToOrderIndex]['xValues'][k]['value'] < 50) && (twoodles[itemsToOrderIndex]['yValues'][j]['index'] == twoodles[itemsToOrderIndex]['items'][i]['index']))
        		{
                	auxItems.push(twoodles[itemsToOrderIndex]['items'][i]);
                }
        	}
        }
	}
	return auxItems;
}
var validAxisNames = true;
var validTwoodleName = true;
function checkAuxValues()
{
	validAxisNames = true;
	validTwoodleName = true;
	if (document.getElementById('inputYAxisName'))
	{
		auxYAxisName = document.getElementById('inputYAxisName').value;
		auxXAxisName = document.getElementById('inputXAxisName').value;
		document.getElementById('divDuplicatedErrorTwoodle').innerHTML = '';
		if (document.getElementById('inputYAxisName').value.toLowerCase() == document.getElementById('inputXAxisName').value.toLowerCase())
		{
			document.getElementById('divDuplicatedErrorTwoodle').innerHTML = '<p class="lblRepeated">Error: duplicated label names</p>';
			validAxisNames = false;
		}
		if (document.getElementById('inputXAxisName').value == '')
		{
			document.getElementById('divDuplicatedErrorTwoodle').innerHTML = '<p class="lblRepeated">Error: empty label name</p>';
			validAxisNames = false;
		}
		if (document.getElementById('inputYAxisName').value == '')
		{
			document.getElementById('divDuplicatedErrorTwoodle').innerHTML = '<p class="lblRepeated">Error: empty label name</p>';
			validAxisNames = false;
		}
		if (document.getElementById('inputYAxisName').value.length > 255)
		{
			document.getElementById('divDuplicatedErrorTwoodle').innerHTML = '<p class="lblRepeated">The Y axis name is taken 255 characters max</p>';
			validAxisNames = false;
		}
		if (document.getElementById('inputXAxisName').value.length > 255)
		{
			document.getElementById('divDuplicatedErrorTwoodle').innerHTML = '<p class="lblRepeated">The X axis name is taken 255 characters max</p>';
			validAxisNames = false;
		}
	}
	document.getElementById('divDuplicatedErrorTwoodleName').innerHTML = '';
	for (var i = 0; i < twoodles.length; i++)
	{
		if (document.getElementById('inputNewTwoodleName').value.toLowerCase() == twoodles[i]['name'].toLowerCase())
		{
			document.getElementById('divDuplicatedErrorTwoodleName').innerHTML = '<p class="lblRepeated">Error: duplicated name</p>';
			validTwoodleName = false;
		}
	}
	if (document.getElementById('inputNewTwoodleName').value == '')
	{
		document.getElementById('divDuplicatedErrorTwoodleName').innerHTML = '<p class="lblRepeated">Error: empty label name</p>';
		validTwoodleName = false;
	}
	if (document.getElementById('inputNewTwoodleName').value.length > 255)
	{
		document.getElementById('divDuplicatedErrorTwoodleName').innerHTML = '<p class="lblRepeated">The name is taken 255 characters max</p>';
		validTwoodleName = false;
	}
}
function checkAuxValuesRename()
{
	validTwoodleName = true;
	validAxisNames = true;
	document.getElementById('divDuplicatedErrorRenameTwoodleName').innerHTML = '';
	for (var i = 0; i < twoodles.length; i++)
	{
		if (document.getElementById('inputRenameTwoodleName').value.toLowerCase() == twoodles[i]['name'].toLowerCase())
		{
			document.getElementById('divDuplicatedErrorRenameTwoodleName').innerHTML = '<p class="lblRepeated">Error: duplicated name</p>';
			validTwoodleName = false;
		}
	}
	if (document.getElementById('inputRenameTwoodleName').value == '')
	{
		document.getElementById('divDuplicatedErrorRenameTwoodleName').innerHTML = '<p class="lblRepeated">Error: empty label name</p>';
		validTwoodleName = false;
	}
	if (validTwoodleName)
	{
		if (document.getElementById('inputRenameTwoodleName').value.split(' ').length > 2)
		{
			document.getElementById('divDuplicatedErrorRenameTwoodleName').innerHTML = '<p class="lblRepeated">Error: exceeds 2 spaces</p>';
			validTwoodleName = false;
		}
	}
	if (document.getElementById('inputRenameTwoodleName').value.length > 255)
	{
		document.getElementById('divDuplicatedErrorRenameTwoodleName').innerHTML = '<p class="lblRepeated">The name is taken 255 characters max</p>';
		validAxisNames = false;
	}
}
function itemsTwoodle()
{
	checkAuxValues();
	if (validTwoodleName && validAxisNames)
	{
		if (document.getElementById('mr').checked)
		{
			auxYAxisName = recipes[Number(document.getElementById('slcRecipe').options[document.getElementById('slcRecipe').selectedIndex].id.split('_')[1])]['defaultY'];
			auxXAxisName = recipes[Number(document.getElementById('slcRecipe').options[document.getElementById('slcRecipe').selectedIndex].id.split('_')[1])]['defaultX'];
		}
		var nextIndex = 0;
		var flag = true;
		while (flag)
		{
			flag = false;
			for (var i = 0; i < twoodles.length; i++)
			{
				if (twoodles[i]['index'] == nextIndex)
				{
					nextIndex++;
					flag = true;
				}
			}
		}
		var newTwoodle = {
			'index' : nextIndex, 
			'type' : 'twoodle', 
			'name' : document.getElementById('inputNewTwoodleName').value, 
			'defaultY' : auxYAxisName, 
			'defaultX' : auxXAxisName, 
			'items' : [], 
			'xValues' : [], 
			'yValues' : []
		};
		twoodles.push(newTwoodle);
		saveValues();
		items = twoodles[selectedTwoodleIndex]['items'];
		fillItemsList();
		document.getElementById('yAxis_name').value = twoodles[selectedTwoodleIndex]['defaultY'];
		document.getElementById('xAxis_name').value = twoodles[selectedTwoodleIndex]['defaultX'];
		document.getElementById('spanYAxis').value = twoodles[selectedTwoodleIndex]['defaultY'];
		document.getElementById('spanXAxis').value = twoodles[selectedTwoodleIndex]['defaultX'];
		yAxisName = twoodles[selectedTwoodleIndex]['defaultY'];
		xAxisName = twoodles[selectedTwoodleIndex]['defaultX'];
		fillArray();
		fillTwoodlesSelect(false);
		selectTwoodle(getTwoodleInSelect(document.getElementById('inputNewTwoodleName').value, 'name'));
		$('#modalNewTwoodle').modal('hide');
	}
}
function getTwoodleInSelect(value, type = 'id')
{
	for (var i = 0; i < document.getElementById('slcTwoodles').children.length; i++)
	{
		if ((type == 'id') && (Number(document.getElementById('slcTwoodles').children[i]['id'].split('_')[1]) == value))
		{
			return i;
		}
		if ((type == 'name') && (document.getElementById('slcTwoodles').children[i].innerHTML == value))
		{
			return i;
		}
	}
}
function selectPreviousTwoodle()
{
	changeSelectedTwoodleIndex();
	document.getElementById('slcTwoodles').selectedIndex = selectedTwoodleIndex + 1;
}
function renameTwoodle()
{
	checkAuxValuesRename();
	if (validTwoodleName)
	{
		var aux = selectedTwoodleIndex;
		for (var i = 0; i < twoodles.length; i++)
		{
			if (twoodles[i]['index'] == selectedTwoodleIndex)
			{
				twoodles[i]['name'] = document.getElementById('inputRenameTwoodleName').value;
			}
		}
		fillArray();
		fillTwoodlesSelect();
		selectTwoodle(getTwoodleInSelect(aux));
		$('#modalRenameTwoodle').modal('hide');
	}
}
var deletedTwoodleIndex = -1;
function deleteTwoodle()
{
	deletedTwoodleIndex = selectedTwoodleIndex;
	var auxTwoodles = [];
	for (var i = 0; i < twoodles.length; i++)
	{
		if (twoodles[i]['index'] != selectedTwoodleIndex)
		{
			auxTwoodles.push(twoodles[i]);
		}
	}
	twoodles = [...auxTwoodles];
	if (!twoodles.length)
	{
		twoodles = [
			{
				'index' : 0, 
				'type' : 'array', 
				'name' : 'All Twoodles', 
				'defaultY' : recipes[0]['defaultY'], 
				'defaultX' : recipes[0]['defaultX'], 
				'items' : [], 
				'xValues' : [], 
				'yValues' : []
			}, 
			{
				'index' : 1, 
				'type' : 'twoodle', 
				'name' : 'Twoodle 1', 
				'defaultY' : recipes[0]['defaultY'], 
				'defaultX' : recipes[0]['defaultX'], 
				'items' : [], 
				'xValues' : [], 
				'yValues' : []
			}
		];
	}
	localStorage.setItem('twoodles', JSON.stringify({'twoodles' : twoodles}));
	fillArray();
	fillTwoodlesSelect();
	selectTwoodle(1);
	document.getElementById('yAxis_name').value = twoodles[selectedTwoodleIndex]['defaultY'];
	document.getElementById('xAxis_name').value = twoodles[selectedTwoodleIndex]['defaultX'];
	document.getElementById('spanYAxis').value = twoodles[selectedTwoodleIndex]['defaultY'];
	document.getElementById('spanXAxis').value = twoodles[selectedTwoodleIndex]['defaultX'];
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;
	checkLblRecipes();
}
function fillArray(save = true)
{
	for (var i = 1; i < twoodles.length; i++)
	{
		for (var j = 0; j < twoodles[0]['items'].length; j++)
		{
			if (twoodles[0]['items'][j]['index'] == twoodles[i]['index'])
			{
				twoodles[0]['items'][j]['name'] = twoodles[i]['name'];
			}
		}
	}
	var auxItems = [...twoodles[0]['items']];
	twoodles[0]['items'] = [];
	var auxXValues = [...twoodles[0]['xValues']];
	twoodles[0]['xValues'] = [];
	var auxYValues = [...twoodles[0]['yValues']];
	twoodles[0]['yValues'] = [];
	
	if ((twoodles.length - 1) > auxItems.length)
	{
		twoodles[0]['items'] = [...auxItems];
		twoodles[0]['xValues'] = [...auxXValues];
		twoodles[0]['yValues'] = [...auxYValues];
		
		twoodles[0]['items'].push({
			'name' : twoodles[twoodles.length - 1]['name'], 
			'index' : twoodles[twoodles.length - 1]['index']
		});
		twoodles[0]['yValues'].push({'value' : 0, 'index' : twoodles[twoodles.length - 1]['index']});
		twoodles[0]['xValues'].push({'value' : 0, 'index' : twoodles[twoodles.length - 1]['index']});
	}
	if ((twoodles.length - 1) < auxItems.length)
	{
		for (var i = 0; i < auxItems.length; i++)
		{
			for (var j = 1; j < twoodles.length; j++)
			{
				if (twoodles[j]['index'] == auxItems[i]['index'])
				{
					twoodles[0]['items'].push({
						'name' : auxItems[i]['name'], 
						'index' : auxItems[i]['index']
					});
				}
				if (twoodles[j]['index'] == auxYValues[i]['index'])
				{
					twoodles[0]['yValues'].push({'value' : 0, 'index' : auxYValues[i]['index']});
				}
				if (twoodles[j]['index'] == auxXValues[i]['index'])
				{
					twoodles[0]['xValues'].push({'value' : 0, 'index' : auxXValues[i]['index']});
				}
			}
		}
	}
	if ((twoodles.length - 1) == auxItems.length)
	{
		twoodles[0]['items'] = [...auxItems];
		twoodles[0]['xValues'] = [...auxXValues];
		twoodles[0]['yValues'] = [...auxYValues];
	}
	if (save)
	{
		saveValues();
	}
	else
	{
		twoodles[0]['items'] = [...auxItems];
		twoodles[0]['xValues'] = [...auxXValues];
		twoodles[0]['yValues'] = [...auxYValues];
	}
}
var selectedTwoodle;
function selectTwoodle(index = null)
{
	if (index != null)
	{
		document.getElementById('slcTwoodles').selectedIndex = index;
	}
	if (document.getElementById('slcTwoodles').selectedIndex)
	{
		for (var i = 0; i < twoodles.length; i++)
		{
			if (document.getElementById('slcTwoodles').children[document.getElementById('slcTwoodles').selectedIndex].innerHTML == twoodles[i]['name'])
			{
				selectedTwoodleIndex = twoodles[i]['index'];
			}
		}
		yValues = twoodles[selectedTwoodleIndex]['yValues'];
		xValues = twoodles[selectedTwoodleIndex]['xValues'];
		items = twoodles[selectedTwoodleIndex]['items'];
		fillItemsList();
		yAxisName = twoodles[selectedTwoodleIndex]['defaultY'];
		xAxisName = twoodles[selectedTwoodleIndex]['defaultX'];
		document.getElementById('yAxis_name').value = twoodles[selectedTwoodleIndex]['defaultY'];
		document.getElementById('xAxis_name').value = twoodles[selectedTwoodleIndex]['defaultX'];
		document.getElementById('spanYAxis').value = twoodles[selectedTwoodleIndex]['defaultY'];
		document.getElementById('spanXAxis').value = twoodles[selectedTwoodleIndex]['defaultX'];
		checkLblRecipes();
	}
	else
	{
		displayNewTwoodleMenu();
	}
	menuItemClicked(['items', 'rateY', 'rateX', 'see'][actualTab - 1]);
	fillLists('y');
	fillLists('x');
	
	verifyItemsNames(false);
	document.getElementById('trashBtn').style.opacity = 1;
	document.getElementById('pencilBtn').style.opacity = 1;
	if (document.getElementById('slcTwoodles').selectedIndex == 1)
	{
		document.getElementById('trashBtn').style.opacity = 0;
		document.getElementById('pencilBtn').style.opacity = 0;
	}
	setUrl();
}