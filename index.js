#!/usr/bin/env node

//Dependencies
var chalk = require('chalk');
var clear = require('clear');
var CLI = require('clui');
var figlet = require('figlet');
var inquirer = require('inquirer');
var Preferences = require('preferences');
var Spinner = CLI.Spinner;
var _ = require('lodash');
var touch = require('touch');
var fs = require('fs');
var open = require("open");
var DownloadService = require('./services/download.service');
var DOMService = require('./services/dom.service');
var AnalyticsService = require('./services/analytics.service');
var FilesService = require('./services/files.service');

//Clear Console
clear();

//Present Welcome Screen
console.log(
	chalk.blue(
		figlet.textSync('Seek3r', {
			horizontalLayout: 'full'
		})
	)
);
console.log(chalk.white.bgBlue.bold('   The Best Markup Reader in the Universe!   '));
console.log("");

//Check if it has arguments
var argv = require('minimist')(process.argv.slice(2));
if (argv["_"].length > 0) {
	//Has args, so start right away
	//log URL
	console.log(chalk.white("URL:") + " " + argv["_"][0]);

	//Start process
	StartProcess(argv["_"][0]);
} else {
	//No arguments, so request it to the user
	//Build Question
	var urlQuestionMessage = "Please Enter the URL from the remote HTML resource:";
	var questions = [{
		name: 'url',
		type: 'input',
		message: urlQuestionMessage,
		validate: function(value) {
			if (value.length) {
				return true;
			} else {
				return urlQuestionMessage;
			}
		}
	}];

	//Launch question
	inquirer.prompt(questions).then((answers) => {
		//We now have an anwser, so start the process
		StartProcess(answers.url);
	});
}

//Start Process of download resource and parse metadata
function StartProcess(url) {
	//Start by Requesting Remoting HTMl Resource
	RequestRemoteHTMLResource(url);
}

function RequestRemoteHTMLResource(url) {
	//Start Loading
	var status = new Spinner('Requesting remote HTML resource, please wait...');
	status.start();

	//Request remote HTML resource
	DownloadService.GetHTMLFileFromURL(url).then((rawData) => {
		//Stop Loading
		status.stop();

		//Log success message
		DisplayDoneMessage("Request remote HTML resource");

		//Parse received data into DOM
		ParseReceivedDataIntoDOM(rawData);

	}).catch((errorMessage) => {
		//Stop Loading
		status.stop();

		//Display error
		DisplayErrorAndExit(errorMessage);
	});
}

function ParseReceivedDataIntoDOM(rawData) {
	//Start Loading
	var status = new Spinner("Parsing received data into DOM, please wait...");
	status.start();

	//Parse received data into Dom
	DOMService.ParseStringToDOMNode(rawData).then((domNode) => {
		//Stop Loading
		status.stop();

		//Log success message
		DisplayDoneMessage("Parse received data into DOM");

		//Process analytics from DOM
		ProcessAnalyticsFromDOM(domNode);

	}).catch((errorMessage) => {
		//Stop Loading
		status.stop();

		//Display error
		DisplayErrorAndExit(errorMessage);
	});
}

function ProcessAnalyticsFromDOM(domNode) {
	//Start Loading
	var status = new Spinner("Processing Analytics from DOM, please wait...");
	status.start();

	var result = AnalyticsService.GetAnalyticsFromDOMNode(domNode, {
		tagCount: true,
		countAttrsByTag: true,
		downloadedResourcesTracking: true,
		childrenTrackByTag: true,
		treeDeep: true
	});

	//Stop Loading
	status.stop();

	//Log success message
	DisplayDoneMessage("Process Analytics from DOM");

	//Save File
	SaveResultFile(result);
}

function SaveResultFile(result) {
	//Start Loading
	status = new Spinner("Saving Result file, please wait...");
	status.start();

	//Check if results directory exists
	var resultsDirectoryPath = "./results";
	if (!fs.existsSync(resultsDirectoryPath)) {
		//Create direcwtory
		fs.mkdirSync(resultsDirectoryPath);
	}

	//Write File
	var NowDate = new Date();
	var fileName = `${NowDate.getFullYear()}_${NowDate.getMonth() + 1}_${NowDate.getDate()}_${NowDate.getHours()}_${NowDate.getMinutes()}_${NowDate.getSeconds()}_${NowDate.getMilliseconds()}`;
	var filePath = resultsDirectoryPath + "/" + fileName + ".json";
	FilesService.WriteObjectToFileSync(filePath, result);

	//Stop Loading
	status.stop();

	//Log success message
	DisplayDoneMessage("Save Results File");

	//Prompt to open file
	//Check for 2nd arg
	if (argv["_"].length > 1 && (argv["_"][1] == "y" || argv["_"][1] == "n")) {
		//Open file if arg says it has to open
		OpenResultsFile(argv["_"][1] == "y", filePath);
	} else {
		//no valid arg, so prompt
		var question = [{
			name: 'openFile',
			type: 'confirm',
			message: "Open results file?",
			validate: function(value) {
				if (value == "y" || value == "n") {
					return true;
				} else {
					return "Open results file?";
				}
			}
		}];

		//Launch question
		inquirer.prompt(question).then((answers) => {
			OpenResultsFile(answers.openFile, filePath);
		});
	}
}

function OpenResultsFile(openFile, filePath) {
	if (openFile) {
		open(filePath);
	}

	//Final log for closure
	console.log("");
	console.log(chalk.white.bgBlue.bold('   Thanks for using Seek3r!   '));
}

//Display error
function DisplayErrorAndExit(errorMessage) {
	//Show error
	console.log(chalk.red("Sorry, but an error occurred:"));
	console.log(chalk.red("(" + errorMessage + ")"));
	console.log();

	//Exit Process
	process.exit();
}


//Display Display Done Message
function DisplayDoneMessage(message) {
	console.log(chalk.white(message) + " " + chalk.green("Done!"));
}
