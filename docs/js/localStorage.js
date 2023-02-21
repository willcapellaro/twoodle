var userID;
var flagShareUpdate = true;
var selectedLocalStorageTab = 'quadrants';
var twoodles;
var items = [];
window.addEventListener('storage', () => {});
function saveAxisNames()
{
	if ((document.getElementById('yAxis_name').value != document.getElementById('xAxis_name').value) && twoodles[selectedTwoodleIndex])
	{
		document.getElementById('spanYAxis').innerHTML = yAxisName;
		document.getElementById('spanXAxis').innerHTML = xAxisName;
		twoodles[selectedTwoodleIndex]['defaultY'] = yAxisName;
		twoodles[selectedTwoodleIndex]['defaultX'] = xAxisName;
	}
	checkLblRecipes();
}
function saveValues()
{
	saveAxisNames();
	localStorage.setItem('twoodles', JSON.stringify({'twoodles': twoodles}));
}
function loadValues()
{
	selectedTwoodle = 0;
	if (localStorage.getItem('twoodles'))
    {
		twoodles = JSON.parse(localStorage.getItem('twoodles'))['twoodles'];
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
		fillArray(false);
		yValues = twoodles[selectedTwoodle]['yValues'];
		xValues = twoodles[selectedTwoodle]['xValues'];
		items = twoodles[selectedTwoodle]['items'];
	}
	else
	{
		localStorage.setItem('twoodles', JSON.stringify({'twoodles' : [{
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
		]}));
		twoodles = JSON.parse(localStorage.getItem('twoodles'))['twoodles'];
		yAxisName = recipes[0]['defaultY'];
		xAxisName = recipes[0]['defaultX'];
		fillArray();
	}
	fillTwoodlesSelect();
	flagShareUpdate = false;
	items = twoodles[0]['items'];
	fillItemsList();
	yAxisName = twoodles[0]['defaultY'];
	xAxisName = twoodles[0]['defaultX'];
	document.getElementById('yAxis_name').value = twoodles[0]['defaultY'];
	document.getElementById('xAxis_name').value = twoodles[0]['defaultX'];
	document.getElementById('spanYAxis').innerHTML = twoodles[0]['defaultY'];
	document.getElementById('spanXAxis').innerHTML = twoodles[0]['defaultX'];
	flagShareUpdate = true;
	selectTwoodle(getTwoodleInSelect(selectedTwoodleIndex));
	menuItemClicked(['items', 'rateY', 'rateX', 'see'][actualTab - 1]);
}
function fillTwoodlesSelect(changeIndex = true)
{
	var html = {
		'NE' : [], 
		'NW' : [], 
		'SE' : [], 
		'SW' : []
	}
	var html = '<option id="optSlcTwoodles_new" onclick="displayNewTwoodleMenu();">+ New Twoodle</option><option id="optSlcTwoodles_0">' + twoodles[0]['name'] + '</option>';
	for (var i = 0; i < quadrantsOrder(0).length; i++)
	{
		html += '<option id="optSlcTwoodles_' + quadrantsOrder(0)[i]['index'] + '">' + quadrantsOrder(0)[i]['name'] + '</option>';
	}
	document.getElementById('slcTwoodles').innerHTML = html;
	if (changeIndex)
	{
		selectTwoodle(getTwoodleInSelect(selectedTwoodleIndex));
	}
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
{
	document.getElementById('clipboardInfo').innerHTML = '';
	selectedLocalStorageTab = tab;
	var localStorageText = '';
	xValues = JSON.parse(localStorage.getItem('twoodles'))['twoodles'][selectedTwoodleIndex]['xValues'];
	yValues = JSON.parse(localStorage.getItem('twoodles'))['twoodles'][selectedTwoodleIndex]['yValues'];
	xAxisName = JSON.parse(localStorage.getItem('twoodles'))['twoodles'][selectedTwoodleIndex]['defaultX'];
	yAxisName = JSON.parse(localStorage.getItem('twoodles'))['twoodles'][selectedTwoodleIndex]['defaultY'];
	items = JSON.parse(localStorage.getItem('twoodles'))['twoodles'][selectedTwoodleIndex]['items'];
	if (xValues || yValues)
	{
		if (tab == 'readable')
		{
			localStorageText = 'Highest to Lowest ' + xAxisName + '<br><br>';
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
			localStorageText += '<br>Highest to Lowest ' + yAxisName + '<br><br>';
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
			document.getElementById('readableBtn').classList.add('resultsModalActiveTab');
			document.getElementById('quadrantsBtn').classList.remove('resultsModalActiveTab');
			document.getElementById('codeBtn').classList.remove('resultsModalActiveTab');
		}
		if (tab == 'code')
		{
			var recipeIndex = checkLblRecipes();
			if (recipeIndex != -1)
			{
				localStorageText = 'recipe id: ' + recipeIndex + '<br>';
				localStorageText += 'recipe Name: ' + recipes[recipeIndex]['recipeName'] + '<br>';
				if (recipes[recipeIndex]['defaultXY'])
				{
					localStorageText += 'defaultXY: Yes<br><br>';
				}
				else
				{
					localStorageText += 'defaultXY: No<br><br>';
				}
			}
			localStorageText += 'xAxisName: ' + xAxisName + '<br>';
			localStorageText += 'yAxisName: ' + yAxisName + '<br><br>';

			if (items && items.length)
			{
				localStorageText += 'items:<br>';
				for (var i = 0; i < items.length; i++)
		    	{
		    		localStorageText += 'name: ' + items[i]['name'] + ', index: ' + items[i]['index'] + '<br>';
		    	}
		    	localStorageText += '<br>';
			}
			
			if (xValues && xValues.length)
			{
				localStorageText += 'xValues:<br>';
				for (var i = 0; i < xValues.length; i++)
		    	{
		    		localStorageText += 'value: ' + xValues[i]['value'] + ', index: ' + xValues[i]['index'] + '<br>';
		    	}
		    	localStorageText += '<br>';
			}

			if (yValues && yValues.length)
			{
				localStorageText += 'yValues:<br>';
				for (var i = 0; i < yValues.length; i++)
		    	{
		    		localStorageText += 'value: ' + yValues[i]['value'] + ', index: ' + yValues[i]['index'] + '<br>';
		    	}
			}
			document.getElementById('readableBtn').classList.remove('resultsModalActiveTab');
			document.getElementById('quadrantsBtn').classList.remove('resultsModalActiveTab');
			document.getElementById('codeBtn').classList.add('resultsModalActiveTab');
		}
		if (tab == 'quadrants')
		{
			var quadrantsTexts = conditionals(xAxisName, yAxisName);
			var html = {
				'NE' : [], 
				'NW' : [], 
				'SE' : [], 
				'SW' : []
			}
			for (var i = 0; i < items.length; i++)
            {
            	for (var j = 0; j < yValues.length; j++)
            	{
            		for (var k = 0; k < xValues.length; k++)
            		{
		                if (yValues[j]['index'] == xValues[k]['index'])
		                {
		                	if (yValues[j]['value'] >= 50)
		                	{
		                		if (xValues[k]['value'] >= 50)
		                		{
		                			if (xValues[k]['index'] == items[i]['index'])
        							{
        								var iconsHTML = items[i]['name'];
										iconsHTML += '<div class="trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(' + items[i]['index'] + ');"></i></div>';
										iconsHTML += '<div class="btn-link linkIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(' + items[i]['index'] + ');"></i></div>';
										iconsHTML += '<div class="pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(' + items[i]['index'] + ');"></i></div>';
										if (items[i]['url'])
										{
											iconsHTML += '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + items[i]['url'] + '\');"></i></div>';
										}
        								if (twoodles[selectedTwoodleIndex]['type'] == 'array')
										{
											iconsHTML = items[i]['name'] + '<div class="btn-link linkIcon"><i class="fa fa-th-large" onclick="selectTwoodle(getTwoodleInSelect(' + items[i]['index'] + '));"> Open Twoodle</i></div>';
										}
										iconsHTML += '<br>';
										html['NE'].push([iconsHTML, (yValues[j]['value'] + xValues[k]['value'])]);
        							}
		                		}
		                		else
		                		{
		                			if (yValues[j]['index'] == items[i]['index'])
        							{
        								var iconsHTML = items[i]['name'];
										iconsHTML += '<div class="trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(' + items[i]['index'] + ');"></i></div>';
										iconsHTML += '<div class="btn-link linkIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(' + items[i]['index'] + ');"></i></div>';
										iconsHTML += '<div class="pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(' + items[i]['index'] + ');"></i></div>';
										if (items[i]['url'])
										{
											iconsHTML += '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + items[i]['url'] + '\');"></i></div>';
										}
        								if (twoodles[selectedTwoodleIndex]['type'] == 'array')
										{
											iconsHTML = items[i]['name'] + '<div class="btn-link linkIcon"><i class="fa fa-th-large" onclick="selectTwoodle(getTwoodleInSelect(' + items[i]['index'] + '));"> Open Twoodle</i></div>';
										}
										iconsHTML += '<br>';
										html['NW'].push([iconsHTML, (yValues[j]['value'] + xValues[k]['value'])]);
        							}
		                		}
		                	}
		                	else
		                	{
		                		if (xValues[k]['value'] >= 50)
		                		{
		                			if (xValues[k]['index'] == items[i]['index'])
        							{
        								var iconsHTML = items[i]['name'];
										iconsHTML += '<div class="trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(' + items[i]['index'] + ');"></i></div>';
										iconsHTML += '<div class="btn-link linkIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(' + items[i]['index'] + ');"></i></div>';
										iconsHTML += '<div class="pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(' + items[i]['index'] + ');"></i></div>';
										if (items[i]['url'])
										{
											iconsHTML += '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + items[i]['url'] + '\');"></i></div>';
										}
        								if (twoodles[selectedTwoodleIndex]['type'] == 'array')
										{
											iconsHTML = items[i]['name'] + '<div class="btn-link linkIcon"><i class="fa fa-th-large" onclick="selectTwoodle(getTwoodleInSelect(' + items[i]['index'] + '));"> Open Twoodle</i></div>';
										}
										iconsHTML += '<br>';
										html['SE'].push([iconsHTML, (yValues[j]['value'] + xValues[k]['value'])]);
        							}
		                		}
		                		else
		                		{
		                			if (yValues[j]['index'] == items[i]['index'])
        							{
        								var iconsHTML = items[i]['name'];
										iconsHTML += '<div class="trashIcon"><i class="bi bi-trash-fill btn-link" onclick="deleteItem(' + items[i]['index'] + ');"></i></div>';
										iconsHTML += '<div class="btn-link linkIcon"><i class="fa-solid fa-arrow-up-from-bracket" data-target="#modalMove" onclick="preMoveItem(' + items[i]['index'] + ');"></i></div>';
										iconsHTML += '<div class="pencilIcon"><i class="bi bi-pencil-fill btn-link" data-target="#modalEdit" onclick="preEditItem(' + items[i]['index'] + ');"></i></div>';
										if (items[i]['url'])
										{
											iconsHTML += '<div class="btn-link linkIcon"><i class="fa-solid fa-link" onclick="window.open(\'' + items[i]['url'] + '\');"></i></div>';
										}
        								if (twoodles[selectedTwoodleIndex]['type'] == 'array')
										{
											iconsHTML = items[i]['name'] + '<div class="btn-link linkIcon"><i class="fa fa-th-large" onclick="selectTwoodle(getTwoodleInSelect(' + items[i]['index'] + '));"> Open Twoodle</i></div>';
										}
										iconsHTML += '<br>';
										html['SW'].push([iconsHTML, (yValues[j]['value'] + xValues[k]['value'])]);
        							}
		                		}
		                	}
		                }
		        	}
	            }
        	}
        	localStorageText = '';
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
	    		localStorageText += '<img src="./img/quadrant' + ['NE', 'NW', 'SE', 'SW'][j] + '.png">    ' + quadrantsTexts[j] + '<br>';
		    	if (!html[['NE', 'NW', 'SE', 'SW'][j]].length)
		    	{
		    		localStorageText += 'No items';
		    	}
	    		for (i = 0; i < html[['NE', 'NW', 'SE', 'SW'][j]].length; i++)
	        	{
					localStorageText += html[['NE', 'NW', 'SE', 'SW'][j]][i][0];
	        	}
	        	localStorageText += '<br>'
	    	}

			document.getElementById('readableBtn').classList.remove('resultsModalActiveTab');
			document.getElementById('quadrantsBtn').classList.add('resultsModalActiveTab');
			document.getElementById('codeBtn').classList.remove('resultsModalActiveTab');
		}
	}
	document.getElementById('localStorageContents').innerHTML = localStorageText;
}
function clearValues()
{
	document.getElementById('modalClear').style.display = 'none';
	idsOrder = [];
	itemMoved = -1;
	validItemsNames = true;
	validAxisNames = true;

	document.getElementById('yAxis_name').value = 'importance';
	document.getElementById('xAxis_name').value = 'urgency';
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;
	document.getElementById('itemsList').innerHTML = '';
	twoodles = [{
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
	}];
	document.getElementById('yAxis_name').value = twoodles[0]['defaultY'];
	document.getElementById('xAxis_name').value = twoodles[0]['defaultX'];
	document.getElementById('spanYAxis').innerHTML = twoodles[0]['defaultY'];
	document.getElementById('spanXAxis').innerHTML = twoodles[0]['defaultX'];
	saveValues();
	document.getElementById('slcTwoodles').selectedIndex = 1;
	selectTwoodle();
	if (document.getElementById("resultsDiv").style.display == "block")
	{
		menuItemClicked('see');
	}
	fillTwoodlesSelect();
	selectedTwoodleIndex = 0;
	document.getElementById('slcTwoodles').selectedIndex = 1;
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;
	checkLblRecipes();
	drawResult();
	displayLocalStorage('quadrants');
	fillArray();
	selectTwoodle(selectedTwoodleIndex + 1);
	fillTwoodlesSelect();
}
function copyContent()
{
	if (navigator.clipboard)
	{
		var text = document.getElementById('localStorageContents').innerText;
		var aux = '';
		var firstChar = false;
		for (var i = 0; i < text.length; i++)
		{
			if (!firstChar)
			{
				if (text[i] != ' ')
				{
					firstChar = true;
				}
			}
			if (firstChar)
			{
				aux += text[i];
				if (text[i] == '\n')
				{
					firstChar = false;
				}
			}
		}
		text = aux;
		if (aux[aux.length - 1] == '\n')
		{
			var finalIndex;
			for (var i = (aux.length - 1); i >= 0; i--)
			{
				if (aux[i] != '\n')
				{
					finalIndex = i;
					i = -1;
				}
			}
			text = '';
			for (var i = 0; i < aux.length; i++)
			{
				if (i <= finalIndex)
				{
					text += aux[i];
				}
			}
		}
		navigator.clipboard.writeText(text);
		document.getElementById('clipboardInfo').classList.add('clipboardInfoSuccess');
		document.getElementById('clipboardInfo').classList.remove('clipboardInfoError');
		document.getElementById('clipboardInfo').innerHTML = 'Content Copied.';
	}
	else
	{
		document.getElementById('clipboardInfo').classList.remove('clipboardInfoSuccess');
		document.getElementById('clipboardInfo').classList.add('clipboardInfoError');
		document.getElementById('clipboardInfo').innerHTML = 'Clipboard not available.';
	}
}
function swap()
{
	var auxY = twoodles[selectedTwoodleIndex]['defaultY'];
	var auxX = twoodles[selectedTwoodleIndex]['defaultX'];
	document.getElementById('yAxis_name').value = auxX;
	document.getElementById('xAxis_name').value = auxY;
	document.getElementById('spanYAxis').innerHTML = auxX;
	document.getElementById('spanXAxis').innerHTML = auxY;
	twoodles[selectedTwoodleIndex]['defaultY'] = document.getElementById('yAxis_name').value;
	twoodles[selectedTwoodleIndex]['defaultX'] = document.getElementById('xAxis_name').value;
	yAxisName = document.getElementById('yAxis_name').value;
	xAxisName = document.getElementById('xAxis_name').value;
	checkLblRecipes();
	for (var i = 0; i < twoodles[selectedTwoodleIndex]['xValues'].length; i++)
	{
		var auxValue = twoodles[selectedTwoodleIndex]['xValues'][i];
		for (var j = 0; j < twoodles[selectedTwoodleIndex]['yValues'].length; j++)
		{
			if (twoodles[selectedTwoodleIndex]['xValues'][i]['index'] == twoodles[selectedTwoodleIndex]['yValues'][j]['index'])
			{
				twoodles[selectedTwoodleIndex]['xValues'][i] = twoodles[selectedTwoodleIndex]['yValues'][j];
				twoodles[selectedTwoodleIndex]['yValues'][j] = auxValue;
			}
		}
	}
	var changes = true;
	while (changes)
	{
		changes = false;
		for (var i = 0; i < twoodles[selectedTwoodleIndex]['xValues'].length - 1; i++)
		{
			if (twoodles[selectedTwoodleIndex]['xValues'][i]['value'] < twoodles[selectedTwoodleIndex]['xValues'][i + 1]['value'])
			{
				var auxValue = twoodles[selectedTwoodleIndex]['xValues'][i];
				twoodles[selectedTwoodleIndex]['xValues'][i] = twoodles[selectedTwoodleIndex]['xValues'][i + 1];
				twoodles[selectedTwoodleIndex]['xValues'][i + 1] = auxValue;
				changes = true;
			}
		}
	}
	changes = true;
	while (changes)
	{
		changes = false;
		for (var i = 0; i < twoodles[selectedTwoodleIndex]['yValues'].length - 1; i++)
		{
			if (twoodles[selectedTwoodleIndex]['yValues'][i]['value'] < twoodles[selectedTwoodleIndex]['yValues'][i + 1]['value'])
			{
				var auxValue = twoodles[selectedTwoodleIndex]['yValues'][i];
				twoodles[selectedTwoodleIndex]['yValues'][i] = twoodles[selectedTwoodleIndex]['yValues'][i + 1];
				twoodles[selectedTwoodleIndex]['yValues'][i + 1] = auxValue;
				changes = true;
			}
		}
	}
	saveValues();
}