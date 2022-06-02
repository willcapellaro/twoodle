var auxYAxisName = 'Y Axis';
var auxXAxisName = 'X Axis';
var selectedTwoodleIndex = 0;
function changeSelectedTwoodleIndex()
{
	for (var i = 0; i < twoodles.length; i++)
	{
		if (twoodles[i]['id'] == selectedTwoodle)
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
			if (!recipes[i]['featuredRecipe'])
			{
				html += '<option id="optSlcRecipe_' + recipes[i]['id'] + '">' + recipes[i]['defaultY'] + '/' + recipes[i]['defaultX'] + '</option>';
			}
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
		if (twoodles[i]['id'] == selectedTwoodle)
		{
			document.getElementById('inputRenameTwoodleName').value = twoodles[i]['name'];
		}
	}
}
var validAxisNames = true;
var validTwoodleName = true;
function checkAuxValues()
{
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
	if (document.getElementById('inputRenameTwoodleName').value.length > 255)
	{
		document.getElementById('divDuplicatedErrorRenameTwoodleName').innerHTML = '<p class="lblRepeated">The name is taken 255 characters max</p>';
		validAxisNames = false;
	}
}
function createTwoodle()
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
				if (twoodles[i]['id'] == nextIndex)
				{
					nextIndex++;
					flag = true;
				}
			}
		}
		var newTwoodle = {
			'id' : nextIndex, 
			'name' : document.getElementById('inputNewTwoodleName').value, 
			'defaultY' : auxYAxisName, 
			'defaultX' : auxXAxisName, 
			'items' : [], 
			'xValues' : [], 
			'yValues' : []
		};
		twoodles.push(newTwoodle);
		selectedTwoodleIndex = twoodles.length - 1;
		selectedTwoodle = nextIndex;
		localStorage.setItem('twoodles', JSON.stringify({'twoodles' : twoodles}));
		fillTwoodlesSelect(false);

		fillItemsList(twoodles[selectedTwoodleIndex]['items']);
		document.getElementById('yAxis_name').value = twoodles[selectedTwoodleIndex]['defaultY'];
		document.getElementById('xAxis_name').value = twoodles[selectedTwoodleIndex]['defaultX'];
		selectTwoodle(twoodles[twoodles.length - 1]['id']);
		document.getElementById('slcTwoodles').selectedIndex = twoodles.length;
	}
}
function renameTwoodle()
{
	if (validTwoodleName)
	{
		for (var i = 0; i < twoodles.length; i++)
		{
			if (twoodles[i]['id'] == selectedTwoodle)
			{
				twoodles[i]['name'] = document.getElementById('inputRenameTwoodleName').value;
			}
		}
		saveValues();
		fillTwoodlesSelect();
	}
}
function deleteTwoodle()
{
	var auxTwoodles = [];
	for (var i = 0; i < twoodles.length; i++)
	{
		if (twoodles[i]['id'] != selectedTwoodle)
		{
			auxTwoodles.push(twoodles[i]);
		}
	}
	twoodles = auxTwoodles;
	if (!twoodles.length)
	{
		twoodles = [{
			'id' : 0, 
			'name' : 'Twoodle 1', 
			'defaultY' : recipes[0]['defaultY'], 
			'defaultX' : recipes[0]['defaultX'], 
			'items' : [], 
			'xValues' : [], 
			'yValues' : []
		}];
	}
	localStorage.setItem('twoodles', JSON.stringify({'twoodles' : twoodles}));
	fillTwoodlesSelect();
	if (twoodles[selectedTwoodleIndex])
	{
		selectedTwoodle = twoodles[selectedTwoodleIndex].id;
	}
	else
	{
		selectedTwoodleIndex = 0;
		selectedTwoodle = twoodles[0].id;
		document.getElementById('slcTwoodles').selectedIndex = 1;
	}
	changeSelectedTwoodleIndex();
	document.getElementById('yAxis_name').value = twoodles[selectedTwoodleIndex]['defaultY'];
	document.getElementById('xAxis_name').value = twoodles[selectedTwoodleIndex]['defaultX'];
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;
	checkLblRecipes();
}
var selectedTwoodle;
function selectTwoodle(selectedIndex = document.getElementById('slcTwoodles').selectedIndex)
{
	if (document.getElementById('slcTwoodles').selectedIndex)
	{
		selectedTwoodle = Number(document.getElementById('slcTwoodles').children[selectedIndex].id.split('_')[1]);
		changeSelectedTwoodleIndex();
		var yValues = twoodles[selectedTwoodleIndex]['yValues'];
		var xValues = twoodles[selectedTwoodleIndex]['xValues'];
		fillItemsList(twoodles[selectedTwoodleIndex]['items']);
		yAxisName = twoodles[selectedTwoodleIndex]['defaultY'];
		xAxisName = twoodles[selectedTwoodleIndex]['defaultX'];
		document.getElementById('yAxis_name').value = twoodles[selectedTwoodleIndex]['defaultY'];
		document.getElementById('xAxis_name').value = twoodles[selectedTwoodleIndex]['defaultX'];
		checkLblRecipes();
	}
	else
	{
		displayNewTwoodleMenu();
	}
}