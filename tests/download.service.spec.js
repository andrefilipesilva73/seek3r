const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const DownloadService = require('../services/download.service');
const DOMService = require('../services/dom.service');

var dummyText = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<html>
<head>
	<title>Dummy html page</title>
<SCRIPT type="text/javascript">
/*<![CDATA[*/
document.cookie = "IV_JCT=%2Fvelocity%2Fcommon; path=/; secure";
/*]]>*/
</SCRIPT>
</head>

<body>
<!--  A dummy html page used to resolve the following internet explorer bug : PRB: Security Warning Message Occurs When You Browse to a Page That Contains an IFRAME Through SSL -->
</body>
</html>`;

describe('The Download Service', function() {
	it('Get HTML File From URL', function() {

		//Get Path
		var resultsFilePath = "https://ecprod.cn.ca/common/html/dummy.html";

		//Parse Dummy text to DOM Node
		return DOMService.ParseStringToDOMNode(dummyText).then((dummyNode) => {

			return DownloadService.GetHTMLFileFromURL(resultsFilePath).then((rawData) => {

				//Parse Raw text to DOM Node
				return DOMService.ParseStringToDOMNode(rawData).then((rawDataNode) => {

					//Assert
					expect(dummyNode[2].children.length).to.equal(rawDataNode[2].children.length);

				});

			}).catch((errorMessage) => {
				throw errorMessage;
			});
		});

	});
});
