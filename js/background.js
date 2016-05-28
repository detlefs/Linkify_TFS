
var defaultOptions = {
	blacklist: '',
	whitelist: '',
	tfs_path: 'http://tfs.across.lan:8080/tfs/DefaultCollection/across/_workitems/edit/',
	regex: '\\b[\\d]{5}\\b'
};

if (localStorage.options && localStorage.options.length > 0)
{
	var options = JSON.parse(localStorage.options);
}
else
{
	var options = defaultOptions;
}

options.blacklist = parseBlacklist(options.blacklist);
options.whitelist = parseWhitelist(options.whitelist);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if ('get_options' == message) {
		sendResponse(options)
		return true;
	}
})

install_notice();

function parseBlacklist(blacklist) {
	if (blacklist instanceof Array)
		return blacklist;
	
	blacklist = blacklist.replace(/\n/g, ',');
	blacklist = blacklist.replace(/,+/g, ',');
	blacklist = blacklist.replace(/^,|,$/g, '');
	blacklist = blacklist.split(',');
	
	for (var i = blacklist.length; i--;)
	    blacklist[i] = blacklist[i].trim();
		
	if (blacklist.length == 1 && !blacklist[0]) 
	    blacklist = [];
		
	return blacklist;
}

function parseWhitelist(whitelist) {
	if (whitelist instanceof Array)
		return whitelist;
	
	whitelist = whitelist.replace(/\n/g, ',');
	whitelist = whitelist.replace(/,+/g, ',');
	whitelist = whitelist.replace(/^,|,$/g, '');
	whitelist = whitelist.split(',');
	
	for (var i = whitelist.length; i--;)
	    whitelist[i] = whitelist[i].trim();
		
	if (whitelist.length == 1 && !whitelist[0]) 
	    whitelist = [];
		
	return whitelist;
}

function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "options.html#install"});
}