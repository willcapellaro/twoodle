var recipes = [
	{
		'id' : 0, 
		'recipeName' : 'Urgent or Important?', 
		'recipeSubName' : 'Urgency vs Importance', 
		'description' : 'Manage your time better with this common matrix. Good for lots of little annoyance.', 
		'defaultY' : 'urgency', 
		'defaultX' : 'importance', 
		'defaultXY' : true, 
		'quadrantLabels' : ['focus', 'delegate', 'schedule', 'avoid']
	}, 
	{
		'id' : 1, 
		'recipeName' : 'Debt Destroyer', 
		'recipeSubName' : 'Interest vs Balance', 
		'description' : 'Got out hock by getting smart about which debts to pay down first.', 
		'defaultY' : 'interest', 
		'defaultX' : 'balance', 
		'defaultXY' : true, 
		'quadrantLabels' : ['pay down asap', 'pay next', 'pay when possible', 'no rush']
	}, 
	{
		'id' : 2, 
		'recipeName' : 'Make an Impact', 
		'recipeSubName' : 'Impact vs Ease', 
		'description' : 'Find out what to focus on as a team or individual.', 
		'defaultY' : 'impact', 
		'defaultX' : 'ease', 
		'defaultXY' : true, 
		'quadrantLabels' : ['strategic', 'high value', 'luxury', 'distractions']
	}, 
	{
		'id' : 3, 
		'recipeName' : 'Task Triage', 
		'recipeSubName' : 'Urgency vs Ease', 
		'description' : 'Scare resources? Find your way out of the mess.', 
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
		recipesdescription = 'Twoodle\'s got you. Here are some of our cherised recipes for thinking:<br>';

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
		document.getElementById('recipeTitleSeeDiv').innerHTML = recipes[recipeIndex]['recipeSubName'];
		
		document.getElementById('xAxis_name').value = auxDefaultX;
		document.getElementById('yAxis_name').value = auxDefaultY;
		verifyAxisNames();
		saveValues();
	}
}