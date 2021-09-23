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
	} else if (y == 'ease' && x == 'importance') {
		texts[0] = 'luxury';
		texts[1] = 'strategic';
		texts[2] = 'distractions';
		texts[3] = 'high value';
	} else if (y == 'importance' && x == 'ease') {
		texts[0] = 'distractions';
		texts[1] = 'strategic';
		texts[2] = 'luxury';
		texts[3] = 'high value';
	} else if (y == 'high interest' && x == 'low balance') {
		texts[0] = 'pay off first';
		texts[1] = 'pay down first';
		texts[2] = 'luxury';
		texts[3] = 'high value';
	}
	return texts;
}