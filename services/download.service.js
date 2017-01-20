//Dependencies
const https = require('https');

/*
 * Download Service for requesting remote resources
 */
module.exports = {
	GetHTMLFileFromURL: function(url) {
		return new Promise((resolve, reject) => {
			https.get(url, (res) => {
				const statusCode = res.statusCode;
				const contentType = res.headers['content-type'];

				//Handle errors
				if (statusCode !== 200) {
					//Not the Expected 200 response :(
					error = new Error(`Request Failed.\n` + `Status Code: ${statusCode}`);

					//Consume response data to free up memory
					res.resume();

					//Reject Request
					reject(error.message);

					//Return method
					return;
				}

				//Set Encoding
				res.setEncoding('utf8');

				//Parse received data
				let rawData = '';
				res.on('data', (chunk) => rawData += chunk);
				res.on('end', () => {
					try {
						//Resolve Request
						resolve(rawData);
					} catch (error) {
						//Reject Request
						reject(error.message);
					}
				});
			}).on('error', (error) => {
				//Reject Request
				reject(error.message);
			});
		});
	}
};
