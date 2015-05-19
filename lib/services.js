
var request = require('request');

module.exports = {
	
	triggerDeploy: function(id) {
		
		var formData = {
			projectId: id
		};
		
		request.post({ url: 'http://urltoservice/triggerdeploy', formData: formData }, function callback(err, httpResponse, body) {
			if (err) {
				return console.error('Trigger deploy service call failed: ', err);
			}
			
			console.log('Trigger deploy service call successful! Server responded with: ', body);
		});
	}
}