function handleMessage(event)
{
	if(event.name == "sendKeys")
	{	sendKeys();	}
}

function sendKeys()
{
	safari.self.tab.dispatchMessage("accessKeyKeys",accessKeyKeys);
	safari.self.tab.dispatchMessage("accessKeyNames",accessKeyNames);
	safari.self.tab.dispatchMessage("bothSent",'');
}

function getElementName(element)	//finds a good name for the access key label
{
	var name = element.textContent;	//just get the unformatted text to use as the name
	
	if (name == '' || name.length == 1)	//if there is no content for the name
	{
		if ((element.type=='submit' || element.type=='button' || element.type=='reset') && element.value != '')	//if it's a button with a value set
		{
			name = element.value;
		}
		else if (element.name != '')	//if a name attribute is present
		{
			name = element.name;
		}
		else if	(element.title != '')	//if a title attribute is present
		{
			name = element.title;
		}
	}
	
	if (name == 'q')	//why is it that so many sites name their search box "q"?
	{
		name = 'search';
	}
	
	return name;
}

function checkForDuplicates(thisKey)	//returns true if no duplicates are found
{
	for (y in accessKeyKeys)	//check this found element's key with the ones already found
	{
		if (accessKeyKeys[y] == thisKey)
		{	return false;	}
	}
	
	return true;
}

if(window == window.top)	//to make sure the script is in the correct frame of the page before doing anything
{
	var accessKeyElements;
	var accessKeyNames = new Array();
	var accessKeyKeys = new Array();
	
	
	safari.self.addEventListener("message",handleMessage,false);
	
	
	accessKeyElements = Sizzle('*[accesskey]');
	
	for (x in accessKeyElements)
	{	
		if (checkForDuplicates(accessKeyElements[x].accessKey) == true)
		{
			accessKeyNames.push(getElementName(accessKeyElements[x]));
			accessKeyKeys.push(accessKeyElements[x].accessKey);
		}
	}
	
	//sendKeys();
}