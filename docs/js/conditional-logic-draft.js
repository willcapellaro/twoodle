function conditionals(x, y)
{
	x = x.toLowerCase();
	y = y.toLowerCase();
	var texts = [('high ' + y + ' and low ' + x), ('high ' + y + ' and high ' + x), ('low ' + y + ' and high ' + x), ('low ' + y + ' and low ' + x)];;
	if (NElbl && NWlbl && SElbl && SWlbl)
	{
		texts = [NElbl, NWlbl, SElbl, SWlbl];
	}
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