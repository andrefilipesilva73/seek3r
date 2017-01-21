const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const FilesService = require('../services/files.service');

describe('The Files Service', function() {
	it('Saves file on file system', function() {

		//Write File
		var NowDate = new Date();
		var resultsFilePath = path.join(__dirname, "../results/test" + NowDate.getMilliseconds() + ".json");
		FilesService.WriteObjectToFileSync(resultsFilePath, {});

		//Check Existence
		var exists = fs.existsSync(resultsFilePath);

		//Delete file
		if (exists) {
			fs.unlinkSync(resultsFilePath);
		}

		//Assert
		expect(exists).to.equal(true);
	});
  it('Saves object right', function() {

		//Write File
		var NowDate = new Date();
		var resultsFilePath = path.join(__dirname, "../results/test" + NowDate.getMilliseconds() + ".json");
		FilesService.WriteObjectToFileSync(resultsFilePath, {
			hello: "world"
		});

		//Check Existence
		var exists = fs.existsSync(resultsFilePath);

    //file contents
    var contents = fs.readFileSync(resultsFilePath, "utf-8");

    //Parse Object
    var resultObject = JSON.parse(contents);

		//Assert
		expect(resultObject.hello).to.equal("world");
	});
})
