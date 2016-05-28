var tfs_path, regex;

function searchForKeyNames()
{	
	function createLinkFromNode(node) {
		var l, m;
		var txt = node.textContent;
		var span = null;
		var p = 0;
		
		if (txt.trim().length == 0)
			return;

		tfsTagExpression = new RegExp("(" + regex + ")", "g");
		
		while ( (m=tfsTagExpression.exec(txt)) !== null)
		{
			if (null===span) {
				// Create a new span for the replaced text and newly created href
				span=document.createElement('span');
			}
	
			// Get the link without trailing dots
			link = m[0].replace(/\.*$/, '');
			
			// Put in text up to the link
			span.appendChild(document.createTextNode(txt.substring(p, m.index)));
			
			// Create a link and put it in the span
			a = document.createElement('a');
			a.className='linkclass';
			a.appendChild(document.createTextNode(link));
			a.setAttribute('href', tfs_path + link);
			a.setAttribute('target', '_blank');
			a.style.textDecoration = "underline";
			
			span.appendChild(a);
			//track insertion point
			p = m.index+m[0].length;
		}
		if (span) {
			// Take the text after the last link
			span.appendChild(document.createTextNode(txt.substring(p, txt.length)));
			
			// Replace the original text with the new span
			try {
				node.parentNode.replaceChild(span, node);
			} catch (e) {
				console.error(e);
				console.log(node);
			}
		}
	}

	if ('text/xml'!=document.contentType && 'application/xml'!=document.contentType) {
		var node, allLinks=findTextNodes();
		for(var i=0; i<allLinks.length; i++) {
			node=allLinks[i];
			createLinkFromNode(node);
		}
	}
	
}

var observer = new MutationObserver(onMutation);
var observerConfig = {
    attributes: false, 
    characterData: false,
    childList: true, 
    subtree: true
};
observer.start = function() {
  observer.observe(document.body, observerConfig);
};
observer.stop = function() {
  observer.disconnect();
};
function onMutation() {
  observer.stop();
  searchForKeyNames();
  observer.start();
}

function findTextNodes(root) {
	root = root || document.body;
	
	var textNodes = [];
	
	var ignoreTags = /^(?:a|noscript|option|script|style|textarea)$/i;
	(function findTextNodes(node) {
	  node = node.firstChild;
	  while (node) {
	    if (node.nodeType == 3)
	      textNodes.push(node)
	    else if (!ignoreTags.test(node.nodeName))
	      findTextNodes(node)
	    node = node.nextSibling;
	  }
	})(root);
	return textNodes;
}


var options = {};
chrome.runtime.sendMessage('get_options', function (options_) {
	options = options_;

	// If whitelist is configured, check if address matches it
	if (options.whitelist.length > 0) {
		for (var i = 0; i < options.whitelist.length; i++) {
			var curResult = RegExp(options.whitelist[i]).test(document.domain);
			if (curResult == true) {
				// Set global regex value
				regex = options.regex;
				
				// Format tfs path with a trailing slash if not present
				tfs_path = options.tfs_path;
				// if (tfs_path.substr(-1) != '/') tfs_path += '/';
			
				// Ready to begin search for key names
				searchForKeyNames();
				observer.start();
				return;
			}
		}
	}
	
	// If no whitelist is configured, simply run
	else {
		// Set global regex value
		regex = options.regex;
		
		// Format tfs path with a trailing slash if not present
		tfs_path = options.tfs_path;
		// if (tfs_path.substr(-1) != '/') tfs_path += '/';
	
		// Ready to begin search for key names
		searchForKeyNames();
		observer.start();
	}
})
