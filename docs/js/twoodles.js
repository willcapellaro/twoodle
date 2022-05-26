var twoodles = [
	{
		'id' : 0, 
		'name' : 'Twoodle 1', 
		'defaultY' : 'urgency', 
		'defaultX' : 'importance'
	}
];
function displayNewTwoodleMenu()
{
	if (document.getElementById('cm').checked)
	{
		var html = '<select class="slcRecipe">';
		//<option id="optSlcRecipe_0"></option>
		for (var i = 0; i < recipes.length; i++)
		{
			html + '<option id="optSlcRecipe_' + i + '">' + recipes[i]['defaultY'] + '/' + recipes[i]['defaultX'] + '</option>'
		}
		html += '</select>';
		document.getElementById('matrixInput').innerHTML = html;
	}
	else
	{
		document.getElementById('matrixInput').innerHTML = '<input class="inputAxisNewTwoodle" type="text" id="inputYAxisName" value="Y Axis"><input class="inputAxisNewTwoodle" type="text" id="inputXAxisName" value="X Axis">';
	}
}
function createTwoodle()
{
	if (document.getElementById('cm').checked)
	{
		for (var i = 0; i < recipes.length; i++)
		{}
	}
	else
	{
	}
}