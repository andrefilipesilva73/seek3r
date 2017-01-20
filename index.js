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
var DownloadService = require('./services/download.service');
var DOMService = require('./services/dom.service');
var AnalyticsService = require('./services/analytics.service');

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
if (argv.length > 0) {
	//Has args, so start right away
	StartProcess(argv[0]);
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
	//Start Loading
	var status = new Spinner('Requesting remote HTML resource, please wait...');
	status.start();

	//Request remote HTML resource
	DownloadService.GetHTMLFileFromURL(url).then((rawData) => {
		//Stop Loading
		status.stop();

		//Log success message
		DisplayDoneMessage("Request remote HTML resource");

		//Start Loading
		status = new Spinner("Parsing received data into DOM, please wait...");
		status.start();

		//Parse received data into Dom
		DOMService.ParseStringToDOMNode(rawData).then((domNode) => {
			//Stop Loading
			status.stop();

			//Log success message
			DisplayDoneMessage("Parse received data into DOM");

			//Start Loading
			status = new Spinner("Processing Analytics from DOM, please wait...");
			status.start();

			var result = AnalyticsService.GetAnalyticsFromDOMNode(domNode, {
				tagCount: false,
				countAttrsByTag: false,
				downloadedResourcesTracking: false,
				childrenTrackByTag: false,
				treeDeep: true
			});

			//Stop Loading
			status.stop();

			//Log success message
			DisplayDoneMessage("Process Analytics from DOM");

			console.log(result);

		}).catch((errorMessage) => {
			//Stop Loading
			status.stop();

			//Display error
			DisplayErrorAndExit(errorMessage);
		});

	}).catch((errorMessage) => {
		//Stop Loading
		status.stop();

		//Display error
		DisplayErrorAndExit(errorMessage);
	});
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
