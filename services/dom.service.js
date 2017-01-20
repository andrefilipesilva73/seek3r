//Dependencies
var htmlparser = require("htmlparser2");

/*
 * XML Service for processing strings into XML nodes
 */
module.exports = {
	ParseStringToDOMNode: function(stringToParse) {
		return new Promise((resolve, reject) => {
			//Build Parser Handler
			var handler = new htmlparser.DomHandler(function(error, dom) {
				if (error) {
					//reject
					reject(error);
				} else {
					//it's all ok, so resolve it
					resolve(dom);
				}
			});

			//Parse string
			var parser = new htmlparser.Parser(handler);
			parser.write(stringToParse);
			parser.done();
		});
	}
};
