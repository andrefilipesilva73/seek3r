const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const DOMService = require('../services/dom.service');

var dummyText = `<html>
    <body>
        <h1>Hello World!</h1>
    </body>
</html>
`;

describe('The DOM Service', function() {
	it('Parse String To DOM Node', function() {

		//Parse Dummy text to DOM Node
		return DOMService.ParseStringToDOMNode(dummyText).then((dummyNode) => {

			//Assert
			expect(dummyNode[0].name).to.equal("html");

		}).catch((errorMessage) => {
			throw errorMessage;
		});

	});
});
