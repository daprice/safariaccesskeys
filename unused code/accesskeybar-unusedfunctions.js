
function clickAccessKey(key)	//sends a message to the injected script to click the element with this key
{
	key = key.charAt(key.length-1);
	
	safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("clickAccessKey",key);
}