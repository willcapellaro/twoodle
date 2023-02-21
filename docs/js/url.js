window.addEventListener('popstate', function() {
    readUrl();
    loadValues();
    saveValues();
    displayLocalStorage('quadrants');
    selectTwoodleTopBottom();
});
function readUrl()
{
	if (localStorage.getItem('twoodles'))
    {
		twoodles = JSON.parse(localStorage.getItem('twoodles'))['twoodles'];
	}
	var twoodle = getQueryVariable('twoodle');
	var tab = Number(getQueryVariable('tab'));
	if (twoodle)
	{
		for (var i = 0; i < twoodles.length; i++)
		{
			if (twoodles[i]['name'] == twoodle)
			{
				selectedTwoodleIndex = twoodles[i]['index'];
			}
		}
	}
	if ((tab > 0) && (tab < 5))
	{
		actualTab = tab;
	}
}

function getQueryVariable(variable)
{
	var query = window.location.search.substring(1);
	var vars = query.split("?");
	for (var i = 0; i < vars.length; i++)
	{
		var pair = vars[i].split("=");
		if (pair[0] == variable)
		{
			while (pair[1].indexOf('%20') != -1)
			{
				pair[1] = pair[1].replace('%20', ' ');
			}
			while (pair[1].indexOf('&') != -1)
			{
				pair[1] = pair[1].replace('&', '');
			}
			return pair[1];
		}
	}
	return false;
}

function setUrl()
{
	var portions = '';
	for (var i = 0; i < (window.location + '').length; i++)
	{
		if ((window.location + '')[i] != '?')
		{
			portions += (window.location + '')[i];
		}
		else
		{
			i = (window.location + '').length;
		}
	}
	portions = portions.split('/');
	if (portions[portions.length - 1].indexOf('index') != -1)
	{
		var url = portions[0];
		for (var i = 1; i < (portions.length - 1); i++)
		{
			url += '/' + portions[i];
		}
		url += '/' + portions[portions.length - 1].split('?')[0];
		if (selectedTwoodleIndex)
		{
			url += '?twoodle=' + twoodles[selectedTwoodleIndex]['name'] + '&';
		}
		url += '?tab=' + actualTab;
		history.pushState(null, "", url);
	}
	else
	{
		var url = portions[0];
		for (var i = 1; i < portions.length; i++)
		{
			url += '/' + portions[i];
		}
		if (portions[portions.length - 1].length)
		{
			url += '/';
		}
		if (location.href.toLowerCase().split('/')[0].indexOf('file') != -1)
		{
			url += 'index.html';
		}
		url += portions[portions.length - 1].split('?')[0];
		if (selectedTwoodleIndex)
		{
			url += '?twoodle=' + twoodles[selectedTwoodleIndex]['name'] + '&';
		}
		url += '?tab=' + actualTab;
		history.pushState(null, "", url);
	}
}