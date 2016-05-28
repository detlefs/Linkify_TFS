var bg = chrome.extension.getBackgroundPage();
var options = {}
var allLoaded = false;
window.addEventListener('load', init, false);

function init() {

  options = bg.options;
	document.getElementById("tfs_path").value = options.tfs_path;

	document.getElementById("regex").value = options.regex;
	// document.getElementById("blacklist").value = options.blacklist;
	document.getElementById("whitelist").value = options.whitelist;

	document.getElementById("options_form").onchange = save;
	
	document.getElementById("tfs_path").onkeyup = save;
	document.getElementById("tfs_path").onclick = save;
	
	document.getElementById("regex").onkeyup = save;
	document.getElementById("regex").onclick = save;
	
	// document.getElementById("blacklist").onkeyup = save;
	// document.getElementById("blacklist").onclick = save;
	
	document.getElementById("whitelist").onkeyup = save;
	document.getElementById("whitelist").onclick = save;

	allLoaded=true;
	
	var hash = window.location.hash.substring(1);
	if (hash == "install")
	{
		document.getElementById('install').style.display = "block";
	}
	
	window.onbeforeunload = function (e) {
    e = e || window.event;

	if(document.getElementById("tfs_path").value.indexOf("example.com") != -1)
	{
		return "Woah there!\n-----------------------\nYou have not changed the default TFS path from the example path.\n\nYou must first properly set this path in order for this extension to function properly.";
	}
	else if(document.getElementById("tfs_path").value.indexOf("/edit/") == -1)
	{
		return "Woah there!\n-----------------------\nMost TFS URLs follow the convention:\nexample.com/tfs/DefaultCollection/across/_workitems/edit/84592\n\nIt does not appear you have the '/edit/' part of the TFS path in the 'TFS Browse Path' URL, meaning your links probably won't operate as expected.\n\nYou are highly encouraged to double-check this before leaving the settings page.";
	} 
    return null;
};
}

function save() {
	if (!allLoaded) return;

	options.tfs_path = document.getElementById("tfs_path").value;
	options.regex = document.getElementById("regex").value;
	// options.blacklist = bg.parseBlacklist(document.getElementById("blacklist").value);
	options.whitelist = bg.parseWhitelist(document.getElementById("whitelist").value);
	
	// Reset to defaults if settings are wiped
	if(options.tfs_path && options.tfs_path.length == 0)
		options.tfs_path = 'https://example.com/browse/';
	/* if(options.backlist && options.backlist.length == 0)
		options.blacklist = 'example.com, another-example.com'; */
	if(options.regex && options.regex.length == 0)
		options.regex = '[\\d]{5}';

	localStorage["options"] = JSON.stringify(options);
	bg.options = options;
}
