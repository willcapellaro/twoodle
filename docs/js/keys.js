function detectKey(e, element = document.getElementById('modalNewTwoodle'))
{
	var keycode = e.keyCode || e.which;
	if ((keycode == 13) && (!($('#inputNotes').is(':focus'))))
	{
		if (element.id == 'modalNewTwoodle')
		{
			document.getElementById('itemsTwoodleBtn').click();
		}
		if (element.id == 'modalRenameTwoodle')
		{
			document.getElementById('renameTwoodleBtn').click();
		}
		if (element.id == 'modalEdit')
		{
			document.getElementById('editItemBtn').click();
		}
		if (element.id == 'modalRenameTwoodle')
		{
			document.getElementById('renameTwoodleBtn').click();
		}
		if (element.id == 'modalMove')
		{
			document.getElementById('moveItemBtn').click();
		}
		if (element.id == 'modalRecipes')
		{
			document.getElementById('btnUseRecipe').click();
		}
	}
}