const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const DOMService = require('../services/dom.service');
const AnalyticsService = require('../services/analytics.service');

var dummyText = `<html>
    <body>
        <h1>Hello World!</h1>
    </body>
</html>
`;

describe('The Analytics Service', function() {
	it('Get Analytics From DOM Node', function() {

		//Parse Dummy text to DOM Node
		return DOMService.ParseStringToDOMNode(dummyText).then((dummyNode) => {

			//Get analytics from dummy node
			var result = AnalyticsService.GetAnalyticsFromDOMNode(dummyNode, {
				tagCount: true,
				countAttrsByTag: true,
				downloadedResourcesTracking: true,
				childrenTrackByTag: true,
				treeDeep: true
			});

			//Assert
			expect(result.treeDeep).to.equal(2);
			expect(result.tagCount.html).to.equal(1);
			expect(result.countAttrsByTag.html).to.equal(0);
			expect(result.downloadedResourcesTracking.video.length).to.equal(0);
			expect(result.childrenTrackByTag.html.count).to.equal(1);

		}).catch((errorMessage) => {
			throw errorMessage;
		});

	});
});
