var yOpen = true;
var xOpen = true;
/*This function is not used at any time.
It seems to me that I wanted to use it to make the 'Rate Y Axis' and 'Rate X Axis' items drop down.*/
function expandCollapseAxis(id)
{
	if (id[0] == 'y')
	{
		if (yOpen)
		{
			document.getElementById(id).innerHTML = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';
			yOpen = false;
			document.getElementById('yItemsList').style.display = 'none';
			document.getElementById('yDivRange').style.display = 'none';
		}
		else
		{
			document.getElementById(id).innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
			yOpen = true;
			document.getElementById('yItemsList').style.display = 'block';
			document.getElementById('yDivRange').style.display = 'block';
		}
	}
	else
	{
		if (xOpen)
		{
			document.getElementById(id).innerHTML = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';
			xOpen = false;
			document.getElementById('xItemsList').style.display = 'none';
			document.getElementById('xDivRange').style.display = 'none';
		}
		else
		{
			document.getElementById(id).innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
			xOpen = true;
			document.getElementById('xItemsList').style.display = 'block';
			document.getElementById('xDivRange').style.display = 'block';
		}
	}
}