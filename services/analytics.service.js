//Dependencies
var htmlparser = require("htmlparser2");
var defaultOptions = {
	tagCount: true,
	countAttrsByTag: true,
	downloadedResourcesTracking: true,
	childrenTrackByTag: true,
	treeDeep: true
}

/*
 * Analytics Service for processing information from a DOM node
 */
module.exports = {
	GetAnalyticsFromDOMNode: function(domNode) {
		var result = {};
		for (var i = 0; i < domNode.length; i++) {
			GetInfoFromDOMNode(domNode[i], defaultOptions, result);
		}
		return result;
	}
};

function GetInfoFromDOMNode(domNode, options, result) {
	//only accept HTML tags
	if (!(domNode.type == "tag" || domNode.type == "script")) {
		return;
	}

	// if (domNode.name == "script") {
	// 	console.log(domNode.type);
	// }

	//Tag Count
	if (options.tagCount == null || options.tagCount == true) {
		//init object
		if (result.tagCount == null) {
			result.tagCount = {};
		}

		//increment count
		if (result.tagCount[domNode.name] == null) {
			result.tagCount[domNode.name] = 1;
		} else {
			result.tagCount[domNode.name]++;
		}
	}

	//Attrs Count
	if (options.countAttrsByTag == null || options.countAttrsByTag == true) {
		//init object
		if (result.countAttrsByTag == null) {
			result.countAttrsByTag = {};
		}

		//increment count
		if (result.countAttrsByTag[domNode.name] == null) {
			result.countAttrsByTag[domNode.name] = 0;
		}
		if (domNode.attribs != null) {
			result.countAttrsByTag[domNode.name] += Object.keys(domNode.attribs).length
		}
	}

	//downloaded Resources Tracking
	if (options.downloadedResourcesTracking == null || options.downloadedResourcesTracking == true) {
		//init object
		if (result.downloadedResourcesTracking == null) {
			result.downloadedResourcesTracking = {
				video: [],
				audio: [],
				img: [],
				link: [],
				script: [],
				embed: []
			};
		}

		//If it's an Media element
		if (result.downloadedResourcesTracking[domNode.name] != null) {
			//increment count
			if (domNode.name == "video" || domNode.name == "audio") {
				//Look for track or source tags
				var foundSource = false;
				for (var i = 0; i < domNode.children.length; i++) {
					if ((domNode.children[i].name == "track" || domNode.children[i].name == "source") && domNode.children[i].attribs != null && domNode.children[i].attribs.src != null) {
						foundSource = true;
						result.downloadedResourcesTracking[domNode.name].push(domNode.children[i].attribs.src);
					}
				}

			} else if (domNode.name == "link") {
				//Look for href attr
				if (domNode.attribs != null && domNode.attribs.href != null) {
					result.downloadedResourcesTracking[domNode.name].push(domNode.attribs.href);
				} else {
					result.downloadedResourcesTracking[domNode.name].push("[inline]");
				}
			} else {
				//Look for src attr
				if (domNode.attribs != null && domNode.attribs.src != null) {
					result.downloadedResourcesTracking[domNode.name].push(domNode.attribs.src);
				} else {
					result.downloadedResourcesTracking[domNode.name].push("[inline]");
				}
			}
		}

	}

	//children Track By Tag
	if (options.childrenTrackByTag == null || options.childrenTrackByTag == true) {
		//init object
		if (result.childrenTrackByTag == null) {
			result.childrenTrackByTag = {};
		}

		//increment count
		if (result.childrenTrackByTag[domNode.name] == null) {
			result.childrenTrackByTag[domNode.name] = {
				count: 0,
				children: []
			};
		}
		if (domNode.children != null) {
			result.childrenTrackByTag[domNode.name].count += domNode.children.length;
			var currentNodeChildren = [];
			for (var i = 0; i < domNode.children.length; i++) {
				currentNodeChildren.push(domNode.children[i].name);
			}
			result.childrenTrackByTag[domNode.name].children.push(currentNodeChildren);
		}
	}

	//has children?
	if (domNode.children != null) {
		//yes, so for each child...
		for (var i = 0; i < domNode.children.length; i++) {
			GetInfoFromDOMNode(domNode.children[i], options, result);
		}
	}
}
