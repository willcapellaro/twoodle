// this includes logic that will allow swapping of x vs y and handling quadrant labels automatically

function conditionals(x, y)
{
	x = x.toLowerCase();
	y = y.toLowerCase();
	var texts = [('high ' + y + ' and low ' + x), ('high ' + y + ' and high ' + x), ('low ' + y + ' and low ' + x), ('low ' + y + ' and high ' + x)];
	
	texts = getTexts(x, y, texts, ['urgency', 'importance'], ['schedule', 'focus', 'avoid', 'delegate']);
	/*In this case when x = 'urgency' and y = 'importance', then the texts will be located as follows:
		'schedule'//topleft
	    'focus'//topright
		'avoid'//bottomleft
		'delegate'//bottomright

	If the values of x and y are swapped, then the order will be:
		'delegate'//topleft
	    'focus'//topright
		'avoid'//bottomleft
		'schedule'//bottomright
	In other words, it will go from '0, 1, 2, 3' to '3, 1, 2, 0'.*/
	
	texts = getTexts(x, y, texts, ['impact', 'ease'], ['luxury', 'strategic', 'distractions', 'high value']);
	
	texts = getTexts(x, y, texts, ['balance', 'interest'], ['pay off first', 'pay down first', 'let be', 'pay off when you can']);
	
	return texts;
}
function getTexts(x, y, texts, axis, auxTexts)
{
	if (x == axis[0] && y == axis[1])
	{
		texts = [...auxTexts];
	}
	if (x == axis[1] && y == axis[0])
	{
		texts = [auxTexts[3], auxTexts[1], auxTexts[2], auxTexts[0]];
	}
	return texts;
}