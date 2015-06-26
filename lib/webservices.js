var request = require('request');

module.exports = function() {
	var self = null;
	this.sockets = null;
	this.apiBaseUrl = 'http://deployerservices.local:49530/api';
	
	this.init = function (websockets) {
		self = this;
		self.sockets = websockets; 
	};
	
	this.getBuildStatus = function() {
		
		request.get({ url: self.apiBaseUrl + '/BuildStatuses' }, function callback(err, httpResponse, body) {
			if (err) {
				return console.error('Get build status service call failed: ', err);
			}
			
			self.sockets.builds.setStatus(body);
			
//				console.log('Get build status service call successful! Server responded with: ', body);
		});
	};
	
	this.getProjects = function(id) {
		
		request.get({ url: self.apiBaseUrl + '/Dashboards' }, function callback(err, httpResponse, body) {
			if (err) {
				return console.error('Get projects service call failed: ', err);
			}
		
			self.sockets.projects.setProjects(body);
//				console.log('Get projects service call successful! Server responded with: ', body);
		});
	};
	
	this.triggerDeploy = function(id) {
		
		console.log('service trigger deploy: ' + id);
		
		var formData = {
			id: id
		};
		
		request.post({ url: self.apiBaseUrl + '/Deploy', formData: formData }, function callback(err, httpResponse, body) {
			if (err) {
				return console.error('Trigger deploy service call failed: ', err);
			}
			
				console.log('Trigger deploy service call successful! Server responded with: ', body);
				
				return body;
		});
	};
};