var accessKeyNames,
	accessKeyKeys,
	toggleSetting = safari.extension.settings.autotoggle;
	
//find toolbar button
var itemArray = safari.extension.toolbarItems;
for (var i = 0; i < itemArray.length; ++i) {
    var item = itemArray[i];
    if (item.identifier == "toggleaccesskeys")
       {
	       var barToggleButton = itemArray[i];
       }
}

function settingChanged(event)
{
	if(event.key == 'autotoggle')
	{
		toggleSetting = event.newValue;
		if (toggleSetting == 0)
		{	toggleBar(1,1);	}
		
		validateButton();
	}
}

function validateButton()
{
	//enable/disable toolbar button
	if( toggleSetting == 1 )
	{
		//barToggleButton.command = null;
		barToggleButton.disabled = true;
		barToggleButton.toolTip = 'Automatically hiding and showing the Access Keys toolbar. Change this in the extension\'s preferences.';
	}
	else
	{
		//barToggleButton.command = 'toggleBar';
		barToggleButton.disabled = false;
		barToggleButton.toolTip = 'Show or hide the Access Keys toolbar';
	}
}

function processMessage(event)
{
	if(event.name == "accessKeyNames")
	{	accessKeyNames = event.message;	}
	
	if(event.name == "accessKeyKeys")
	{	accessKeyKeys = event.message;	}
	
	if(event.name == "bothSent")
	{	$('body').empty();
		processAccessKeys(accessKeyNames,accessKeyKeys);	}
}

function askForKeys()
{
	if( safari.application.activeBrowserWindow.activeTab.url )
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('sendKeys','');
	else
	{
		emptyBar();
	}
}

function userToggleBar(event) //called when the user attempts to toggle the bar using the toolbar button
{
	if(event.command == 'toggleBar' && toggleSetting == false) //only listen to the user if automatic toggling is turned off
	{
		const bars = safari.extension.bars;
		const activeBrowserWindow = safari.application.activeBrowserWindow;
		for (var i = 0; i < bars.length; ++i) {
		    var bar = bars[i];
		    if (bar.browserWindow === activeBrowserWindow && bar.identifier === "Access Keys")
		       {
			       
			       	if(bar.visible == 1)
			       	{
			       		bar.hide();
			       	}
			       	else
			       	{
			       		bar.show();
			       	}
		       }
		}
	}
}

function toggleBar(newVis,override)
{
	if(toggleSetting == true || override == true)
	{
		const bars = safari.extension.bars;
		const activeBrowserWindow = safari.application.activeBrowserWindow;
		for (var i = 0; i < bars.length; ++i) {
		    var bar = bars[i];
		    if (bar.browserWindow === activeBrowserWindow && bar.identifier === "Access Keys")
		       {
			       if(bar.visible != newVis)
			       {
			       	if(newVis == 1)
			       	{
			       		bar.show();
			       	}
			       	else if (newVis == 0)
			       	{
			       		bar.hide();
			       	}
			       }
		       }
		}
	}
}

function shortenName(name)
{
	if (name.length > 10)
	{
		name = name.substring(0,6) + '&hellip;';
		//in the future: try to cut off at word break if possible
	}
	return name;
}

function emptyBar() //forces "no access keys found" to be displayed in the bar
{
	$('body').empty();
	processAccessKeys(null, null);
}

function processAccessKeys(names,keys)	//puts a button in the toolbar for each access key
{
	if (!names)
		barToggleButton.badge = 0;
	else
		barToggleButton.badge = names.length;
	
	if (!names || names.length == 0)
	{
		var thisText = 'No access key shortcuts found';
		$('body').append('<p>'+thisText+'</p>');
		toggleBar(0,0);
	}
	else
	{
		for (x in names)
		{
			if (names.length > 12)
			{
				var thisText = shortenName(names[x]) + ' (' + keys[x] + ')';
				$('body').append('<p title="'+names[x]+'">'+thisText+'</p>');
			}
			else
			{
				var thisText = names[x] + ' (' + keys[x] + ')';
				$('body').append('<p>'+thisText+'</p>');
			}
			$('body').className = $('body').className; //force the toolbar to redraw itself to work around an apparent safari bug where some of the content would be cut off
		}
		toggleBar(1,0);
	}
}


safari.application.activeBrowserWindow.addEventListener('message',processMessage,false);
safari.self.browserWindow.addEventListener("command", userToggleBar, false);
safari.extension.settings.addEventListener("change", settingChanged, false);

//ask the page for a list of access keys at appropriate times
safari.self.browserWindow.addEventListener('activate', askForKeys, true);
safari.self.browserWindow.addEventListener('navigate', askForKeys, false);
safari.self.browserWindow.addEventListener('beforeNavigate', emptyBar, false);

validateButton();
processAccessKeys();

