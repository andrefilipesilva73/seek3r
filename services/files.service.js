//Dependencies
var fs = require('fs');

/*
 * Files Service for processing files
 */
module.exports = {
	//Write JavaScript Object to file
	WriteObjectToFileSync: function(filePath, obj) {
		fs.writeFileSync(filePath, JSON.stringify(obj, null, 4));
	}
};
