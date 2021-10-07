// marcelo, this is the doc that needs a logic improvement. I don't want to have to have to code the same conditions twice.
// see the conditions here, they are all sets of two duplicates
// i'd like to have just a section of mappings, or have a function covert
// this goes along with the button to swap X/Y.

function conditionals(x, y)
{
	x = x.toLowerCase();
	y = y.toLowerCase();
	var texts = [('high ' + y + ' and low ' + x), ('high ' + y + ' and high ' + x), ('low ' + y + ' and high ' + x), ('low ' + y + ' and low ' + x)];
	if (x == 'urgency' && y == 'importance')
	{
		texts[0] = 'schedule';//topleft
        texts[1] = 'focus';//topright
		texts[2] = 'avoid';//bottomleft
		texts[3] = 'delegate';//bottomright
	}

	if (x == 'importance')
	{
		if (y == 'urgency') 
		{
			texts[0] = 'avoid';
			texts[1] = 'focus';
			texts[2] = 'schedule';
			texts[3] = 'delegate';
		}
		if (y == 'ease')
		{
			texts[0] = 'luxury';
			texts[1] = 'strategic';
			texts[2] = 'distractions';
			texts[3] = 'high value';
		}
	}
	if (x == 'ease' && y == 'importance')
	{
		texts[0] = 'distractions';
		texts[1] = 'strategic';
		texts[2] = 'luxury';
		texts[3] = 'high value';
	}

	if (x == 'low balance' && y == 'high interest')
	{
		texts[0] = 'pay off first';
		texts[1] = 'pay down first';
		texts[2] = 'luxury';
		texts[3] = 'high value';
	}
	if (x == 'high interest' && y == 'low balance')
	{
		texts[0] = 'luxury';
		texts[1] = 'pay down first';
		texts[2] = 'pay off first';
		texts[3] = 'high value';
	}
	return texts;
}