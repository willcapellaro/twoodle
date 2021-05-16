function conditionals(x, y)
{
	x = x.toLowerCase();
	y = y.toLowerCase();
	var texts = [('high ' + y + ' and low ' + x), ('high ' + y + ' and high ' + x), ('low ' + y + ' and high ' + x), ('low ' + y + ' and low ' + x)];
	if (y == 'importance' && x == 'urgency') {
		texts[0] = 'schedule';//topleft
        texts[1] = 'focus';//topright
		texts[2] = 'avoid';//bottomleft
		texts[3] = 'delegate';//bottomright
	} else if (y == 'urgency' && x == 'importance') {
		texts[0] = 'avoid';
		texts[1] = 'focus';
		texts[2] = 'schedule';
		texts[3] = 'delegate';
	} else if (y == 'ease' && x == 'impact') {
		texts[0] = 'luxuries';
		texts[1] = 'strategic';
		texts[2] = 'quick wins';
		texts[3] = 'high value';
	} else if (y == 'impact' && x == 'ease') {
		texts[0] = 'luxuries';
		texts[1] = 'high value';
		texts[2] = 'strategic';
		texts[3] = 'quick wins';
	} else if (y == 'interest' && x == 'balance') {
		texts[0] = 'pay off when you can';
		texts[1] = 'pay down first';
		texts[2] = 'pay off when you want';
		texts[3] = 'let it ride';
	} else if (y == 'balance' && x == 'interest') {
		texts[0] = 'pay off when you can';
		texts[1] = 'pay down first';
		texts[2] = 'pay off when you want';
		texts[3] = 'let it ride';
	} else if (y == 'a' && x == 'b') {
		texts[0] = 'a -b';
		texts[1] = 'a b';
		texts[2] = '-a -b';
		texts[3] = '-a b';
	} else if (y == 'b' && x == 'a') {
		texts[0] = '-a b';
		texts[1] = 'a b';
		texts[2] = '-a -b';
		texts[3] = 'a -b';
	}
	return texts;
}


//for inverse duplicates swap [0] and [4] (first and last)