var recipes = [
	{
		'id' : 0, 
		'recipeName' : 'Urgent or Important?', 
		'recipeSubName' : 'Urgency vs Importance', 
		'blog' : 'blog-urgency-importance.html', 
		'description' : 'Manage your time better with this common matrix. Recommended when tasks differ.', 
		'defaultY' : 'urgency', 
		'defaultX' : 'importance', 
		'defaultXY' : true, 
		'quadrantLabels' : ['focus', 'delegate', 'schedule', 'avoid']
	}, 
	{
		'id' : 1, 
		'recipeName' : 'Debt Destroyer', 
		'recipeSubName' : 'Interest vs Balance', 
		'blog' : 'blog-interest-balance.html', 
		'description' : 'Got out of hock by paying down debts strategically.', 
		'defaultY' : 'interest', 
		'defaultX' : 'balance', 
		'defaultXY' : true, 
		'quadrantLabels' : ['pay down asap', 'pay next', 'pay when possible', 'no rush']
	}, 
	{
		'id' : 2, 
		'recipeName' : 'Make an Impact', 
		'recipeSubName' : 'Impact vs Ease', 
		'blog' : 'blog-impact-ease.html', 
		'description' : 'Find out what to focus on that will create lasting value with finite resources.', 
		'defaultY' : 'impact', 
		'defaultX' : 'ease', 
		'defaultXY' : true, 
		'quadrantLabels' : ['strategic', 'high value', 'luxury', 'distractions']
	}, 
	{
		'id' : 3, 
		'recipeName' : 'Task Triage', 
		'recipeSubName' : 'Urgency vs Ease', 
		'blog' : 'blog-urgency-ease.html', 
		'description' : 'Scarce time resources? Find your way out of the mess. Recommended when you have quantity of tasks', 
		'defaultY' : 'urgency', 
		'defaultX' : 'ease', 
		'defaultXY' : true, 
		'quadrantLabels' : ['do now', 'do soon', 'schedule/delegate', 'don\'t do']
	}
];
function displayRecipes()
{
	document.getElementById('btnUseRecipe').classList.remove('buttonGrey');
	document.getElementById('btnUseRecipe').classList.remove('button');
	document.getElementById('btnUseRecipe').classList.add('buttonGrey');
	if (recipes.length)
	{
		recipesdescription = 'Twoodle\'s got you. Here are some of our cherished recipes for thinking fluidly:<br>';

		for (var i = 0; i < recipes.length; i++)
    	{
    		{
    			recipesdescription += '<div id="recipe_' + recipes[i]['id'] + '" style="border:1px solid gray; border-radius: 5px;" onclick="preSelectRecipe(this)"><h4>' + recipes[i]['recipeName'] + '</h4><h5 style="color: gray;">' + recipes[i]['recipeSubName'] + '</h5>' + recipes[i]['description'] + '</div><br>';
    		}
    	}
    	recipesdescription += '<br>';
	}
	document.getElementById('recipesContents').innerHTML = recipesdescription;
}
var auxDefaultX;
var auxDefaultY;
var NElbl;
var NWlbl;
var SElbl;
var SWlbl;
var recipeIndex;

function preSelectRecipe(element)
{
	recipeIndex = Number(element.id.split('_')[1]);
	
	for (var i = 0; i < recipes.length; i++)
	{
		{
			document.getElementById('recipe_' + recipes[i]['id']).classList.remove('selectedRecipe');
		}
	}
	element.classList.add('selectedRecipe');
	document.getElementById('btnUseRecipe').classList.remove('buttonGrey');
	document.getElementById('btnUseRecipe').classList.remove('button');
	document.getElementById('btnUseRecipe').classList.add('button');
}
function selectRecipe()
{
	if ((recipeIndex != null) && (recipeIndex != undefined) && !document.getElementById('btnUseRecipe').classList.contains('buttonGrey'))
	{
		auxDefaultX = recipes[recipeIndex]['defaultX'];
		auxDefaultY = recipes[recipeIndex]['defaultY'];
		NElbl = recipes[recipeIndex]['quadrantLabels'][0].toLowerCase();
		NWlbl = recipes[recipeIndex]['quadrantLabels'][1].toLowerCase();
		SElbl = recipes[recipeIndex]['quadrantLabels'][2].toLowerCase();
		SWlbl = recipes[recipeIndex]['quadrantLabels'][3].toLowerCase();

		document.getElementById('recipeTitleItemsDiv').innerHTML = recipes[recipeIndex]['recipeSubName'];
		document.getElementById('recipeTitleRateYDiv').innerHTML = recipes[recipeIndex]['recipeSubName'];
		document.getElementById('recipeTitleRateXDiv').innerHTML = recipes[recipeIndex]['recipeSubName'];
		document.getElementById('recipeTitleresultsDiv').innerHTML = recipes[recipeIndex]['recipeSubName'];
		
		document.getElementById('yAxis_name').value = auxDefaultY;
		document.getElementById('xAxis_name').value = auxDefaultX;
		document.getElementById('spanYAxis').innerHTML = auxDefaultY;
		document.getElementById('spanXAxis').innerHTML = auxDefaultX;
		verifyAxisNames();
		saveValues();
	}
}