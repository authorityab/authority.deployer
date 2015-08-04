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

		request.get({ url: self.apiBaseUrl + '/Builds' }, function callback(err, httpResponse, body) {
			if (!err) {
				self.sockets.builds.setStatus(body);

					// console.log('Get build status service call successful! Server responded with: ', body);
			} else {
				return console.error('Get build status service call failed: ', err);
			}

		});
	};

	this.getLatestFailedBuild = function() {

		request.get({ url: self.apiBaseUrl + '/Builds/LatestFailed' }, function callback(err, httpResponse, body) {

			if (!err) {
				self.sockets.builds.setLatestFailedBuild(body);

	//				console.log('Get build status service call successful! Server responded with: ', body);
			} else {
				return console.error('Get latest failed build service call failed: ', err);
			}

		});
	};

	this.getDeployStatus = function(id) {


		// var formData = {
		// 	taskId: taskId
		// };

		request.get({ url: self.apiBaseUrl + '/Deploy/Status/' + id }, function callback(err, httpResponse, body) {

			if (!err) {
				self.sockets.deploy.setStatus(body);

					console.log('Get build status service call successful! Server responded with: ', body);
			} else {
				return console.error('Get deploy status service call failed: ', err);
			}

		});
	};


	this.getProjects = function() {

		request.get({ url: self.apiBaseUrl + '/Projects' }, function callback(err, httpResponse, body) {

			if (!err) {
				self.sockets.projects.set(body);
				// console.log('Get projects service call successful! Server responded with: ', body);
			} else {
				return console.error('Get projects service call failed: ', err);
			}

		});
	};

	this.getReleases = function(projectId) {

		request.get({ url: self.apiBaseUrl + '/Releases?projectId=' + projectId }, function callback(err, httpResponse, body) {

			if (!err) {
				self.sockets.releases.set(body);
				console.log('Get releases service call successful! Server responded with: ', body);
			} else {
				return console.error('Get releases service call failed: ', err);
			}

		});
	};

	this.getEnvironments = function() {

		request.get({ url: self.apiBaseUrl + '/Environments' }, function callback(err, httpResponse, body) {

			if (!err) {
				self.sockets.environments.set(body);
				console.log('Get environments service call successful! Server responded with: ', body);
			} else {
				return console.error('Get environments service call failed: ', err);
			}

		});
	};

	this.getEnvironments = function() {

		request.get({ url: self.apiBaseUrl + '/Environments' }, function callback(err, httpResponse, body) {

			if (!err) {
				self.sockets.environments.set(body);
				console.log('Get releases service call successful! Server responded with: ', body);
			} else {
				return console.error('Get releases service call failed: ', err);
			}

		});
	};

	this.getLatestDeploys = function(projectId) {

		request.get({ url: self.apiBaseUrl + '/Deploy/GetLatest/?projectId=' + projectId }, function callback(err, httpResponse, body) {

			if (!err) {
				self.sockets.deploy.setLatest(body);
				console.log('Get latest deploys service call successful! Server responded with: ', body);
			} else {
				return console.error('Get latest deploys service call failed: ', err);
			}

		});
	};



	this.triggerDeploy = function(projectId, releaseId, environmentId) {

		console.log('service trigger deploy, projectId: ' + projectId);
		console.log('service trigger deploy, releaseId: ' + releaseId);
		console.log('service trigger deploy, environmentId: ' + environmentId);

		// var formData = {
		// 	id: id
		// };

		request.post({ url: self.apiBaseUrl + '/Deploy/', body: { projectId : projectId, releaseId: releaseId, environmentId: environmentId }, json: true}, function callback(err, httpResponse, body) {

			if (!err) {
				console.log('Trigger deploy service call successful! Server responded with: ', body);
				self.sockets.deploy.started(body);
			} else {
				return console.error('Trigger deploy service call failed: ', err);
			}

		});
	};
};
