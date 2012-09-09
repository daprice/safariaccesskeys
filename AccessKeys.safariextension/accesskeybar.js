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
	safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('sendKeys','');
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

function processAccessKeys(names,keys)	//puts a button in the toolbar for each access key
{
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
		}
		toggleBar(1,0);
	}
}


safari.application.activeBrowserWindow.addEventListener('message',processMessage,false);
safari.self.browserWindow.addEventListener("command", userToggleBar, false);
safari.extension.settings.addEventListener("change", settingChanged, false);

processAccessKeys();

updateInterval = setInterval('askForKeys()', 1000);