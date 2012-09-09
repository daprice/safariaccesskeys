function clickAccessKey(key)
{
	if(window == window.top)
	{
		elementToClick = Sizzle('*[accesskey='+key+']');
//		alert(elementToClick[0].toString());
		elementToClick[0].focus();
//		elementToClick[0].click();
	}
}