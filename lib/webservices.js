var request = require('request');

module.exports = function() {
	var self = null;
	this.sockets = null;

	// TODO: Change this url in production!
	this.apiBaseUrl = 'http://authority.api.local:49530/api';

	this.init = function (websockets) {
		self = this;
		this.sockets = websockets;
	};

	this.getBuilds = function(hollaback) {
		request.get({ url: self.apiBaseUrl + '/Builds' }, function (err, httpResponse, body) {
			if (!err) {
				hollaback(body);
				// console.log('Get builds service call successful! Server responded with: ', body);
			} else {
				return console.error('Get builds service call failed: ', err);
			}
		});
	};

	this.getLatestFailedBuild = function(hollaback) {
		request.get({ url: self.apiBaseUrl + '/Builds/LatestFailed' }, function (err, httpResponse, body) {
			if (!err) {
				hollaback(body);
				// console.log('Get build status service call successful! Server responded with: ', body);
			} else {
				return console.error('Get latest failed build service call failed: ', err);
			}
		});
	};

	this.getProjects = function(hollaback) {
		request.get({ url: self.apiBaseUrl + '/Projects' }, function callback(err, httpResponse, body) {
			if (!err) {
				hollaback(body);
				// console.log('Get projects service call successful! Server responded with: ', body);
			} else {
				return console.error('Get projects service call failed: ', err);
			}
		});
	};

	this.getReleases = function(projectId, hollaback) {
		request.get({ url: self.apiBaseUrl + '/Releases?projectId=' + projectId }, function callback(err, httpResponse, body) {
			if (!err) {
				hollaback(body);
				// console.log('Get releases service call successful! Server responded with: ', body);
			} else {
				return console.error('Get releases service call failed: ', err);
			}
		});
	};

	this.getEnvironments = function(projectId, releaseId, hollaback) {
		request.get({ url: self.apiBaseUrl + '/Environments?projectId=' + projectId + "&releaseId=" + releaseId }, function callback(err, httpResponse, body) {
			if (!err) {
				hollaback(body);
				//  console.log('Get environments service call successful! Server responded with: ', body);
			} else {
				return console.error('Get environments service call failed: ', err);
			}
		});
	};

	this.triggerDeploy = function(projectId, releaseId, environmentId) {
		request.post({ url: self.apiBaseUrl + '/Deploy/', body: { projectId : projectId, releaseId: releaseId, environmentId: environmentId }, json: true}, function callback(err, httpResponse, body) {
			if (!err) {
				self.sockets.deploy.started(body);
				// console.log('Trigger deploy service call successful! Server responded with: ', body);
			} else {
				return console.error('Trigger deploy service call failed: ', err);
			}

		});
	};

	this.getDeployStatus = function(id) {
		request.get({ url: self.apiBaseUrl + '/Deploy/Status?taskId=' + id }, function callback(err, httpResponse, body) {
			if (!err) {
				self.sockets.deploy.setStatus(body);
				// console.log('Get build status service call successful! Server responded with: ', body);
			} else {
				return console.error('Get deploy status service call failed: ', err);
			}
		});
	};
};
