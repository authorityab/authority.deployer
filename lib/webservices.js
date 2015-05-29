//var outputs = require('./outputs');
//var services = require('./services');
var request = require('request');

module.exports = function() {
	var self = null;
	this.sockets = null;
	this.apiBaseUrl = 'http://deployerservices.local:49530/api/Deployer';
	
	this.init = function (websockets) {
		self = this;
		self.sockets = websockets; 
	};
	
	this.getBuildStatus = function() {
		
		request.get({ url: self.apiBaseUrl + '/GetBuildStatus' }, function callback(err, httpResponse, body) {
			if (err) {
				return console.error('Get build status service call failed: ', err);
			}
			
			self.sockets.builds.setStatus(body);
			
//				console.log('Get build status service call successful! Server responded with: ', body);
		});
	};
	
	this.getProjects = function(id) {
		
		request.get({ url: self.apiBaseUrl + '/GetDashboard' }, function callback(err, httpResponse, body) {
			if (err) {
				return console.error('Get projects service call failed: ', err);
			}
			
			
//			var testBody = "{\"Projects\":[{\"Id\":\"projects-97\",\"Name\":\"AllaFamiljehem.Web\",\"Slug\":\"allafamiljehem-web\",\"ProjectGroupId\":\"ProjectGroups-35\",\"Links\":{\"Self\":{}}},{\"Id\":\"projects-65\",\"Name\":\"Leksand.Intranet\",\"Slug\":\"leksand-intranet\",\"ProjectGroupId\":\"ProjectGroups-65\",\"Links\":{\"Self\":{}}},{\"Id\":\"projects-1\",\"Name\":\"Poc-Octopus\",\"Slug\":\"poc-octopus\",\"ProjectGroupId\":\"ProjectGroups-33\",\"Links\":{\"Self\":{}}},{\"Id\":\"projects-33\",\"Name\":\"SoftResource.Web\",\"Slug\":\"softresource-web\",\"ProjectGroupId\":\"ProjectGroups-34\",\"Links\":{\"Self\":{}}}],\"ProjectGroups\":[{\"Id\":\"ProjectGroups-33\",\"Name\":\"POC\",\"EnvironmentIds\":[\"Environments-1\",\"Environments-2\",\"Environments-3\",\"Environments-4\",\"Environments-33\"],\"Links\":{\"Self\":{}}},{\"Id\":\"ProjectGroups-34\",\"Name\":\"SoftResource\",\"EnvironmentIds\":[\"Environments-1\",\"Environments-2\",\"Environments-3\",\"Environments-4\",\"Environments-33\"],\"Links\":{\"Self\":{}}},{\"Id\":\"ProjectGroups-35\",\"Name\":\"XFAM AB\",\"EnvironmentIds\":[\"Environments-1\",\"Environments-2\",\"Environments-3\",\"Environments-4\",\"Environments-33\"],\"Links\":{\"Self\":{}}},{\"Id\":\"ProjectGroups-65\",\"Name\":\"Leksands kommun\",\"EnvironmentIds\":[\"Environments-1\",\"Environments-2\",\"Environments-3\",\"Environments-4\",\"Environments-33\"],\"Links\":{\"Self\":{}}}],\"Environments\":[{\"Id\":\"Environments-1\",\"Name\":\"DEV\",\"Links\":{\"Self\":{}}}],\"Items\":[{\"Id\":\"deployments-2\",\"ProjectId\":\"projects-1\",\"EnvironmentId\":\"Environments-1\",\"ReleaseId\":\"releases-2\",\"DeploymentId\":\"deployments-2\",\"TaskId\":\"ServerTasks-388\",\"ReleaseVersion\":\"0.0.2\",\"Created\":\"2015-05-05T16:20:38.632+02:00\",\"QueueTime\":\"2015-05-05T16:20:38.608+02:00\",\"CompletedTime\":\"2015-05-05T16:21:07.274+02:00\",\"State\":6,\"HasPendingInterruptions\":false,\"HasWarningsOrErrors\":false,\"ErrorMessage\":\"\",\"Duration\":\"29 seconds\",\"IsCurrent\":false,\"IsPrevious\":false,\"Links\":{\"Self\":{},\"Release\":{},\"Task\":{}}},{\"Id\":\"deployments-225\",\"ProjectId\":\"projects-65\",\"EnvironmentId\":\"Environments-1\",\"ReleaseId\":\"releases-225\",\"DeploymentId\":\"deployments-225\",\"TaskId\":\"ServerTasks-2371\",\"ReleaseVersion\":\"1.0.1-alfa5\",\"Created\":\"2015-05-26T18:02:48.645+02:00\",\"QueueTime\":\"2015-05-26T18:02:48.632+02:00\",\"CompletedTime\":\"2015-05-26T18:03:25.359+02:00\",\"State\":6,\"HasPendingInterruptions\":false,\"HasWarningsOrErrors\":false,\"ErrorMessage\":\"\",\"Duration\":\"37 seconds\",\"IsCurrent\":false,\"IsPrevious\":false,\"Links\":{\"Self\":{},\"Release\":{},\"Task\":{}}},{\"Id\":\"deployments-398\",\"ProjectId\":\"projects-97\",\"EnvironmentId\":\"Environments-1\",\"ReleaseId\":\"releases-398\",\"DeploymentId\":\"deployments-398\",\"TaskId\":\"ServerTasks-2769\",\"ReleaseVersion\":\"1.0.1-alfa65\",\"Created\":\"2015-05-28T10:35:15.938+02:00\",\"QueueTime\":\"2015-05-28T10:35:15.928+02:00\",\"CompletedTime\":\"2015-05-28T10:36:30.673+02:00\",\"State\":6,\"HasPendingInterruptions\":false,\"HasWarningsOrErrors\":false,\"ErrorMessage\":\"\",\"Duration\":\"1 minute\",\"IsCurrent\":false,\"IsPrevious\":false,\"Links\":{\"Self\":{},\"Release\":{},\"Task\":{}}},{\"Id\":\"deployments-414\",\"ProjectId\":\"projects-33\",\"EnvironmentId\":\"Environments-1\",\"ReleaseId\":\"releases-414\",\"DeploymentId\":\"deployments-414\",\"TaskId\":\"ServerTasks-2790\",\"ReleaseVersion\":\"1.0.1-alfa105\",\"Created\":\"2015-05-28T13:50:38.283+02:00\",\"QueueTime\":\"2015-05-28T13:50:38.27+02:00\",\"CompletedTime\":\"2015-05-28T13:51:35.4+02:00\",\"State\":6,\"HasPendingInterruptions\":false,\"HasWarningsOrErrors\":false,\"ErrorMessage\":\"\",\"Duration\":\"57 seconds\",\"IsCurrent\":false,\"IsPrevious\":false,\"Links\":{\"Self\":{},\"Release\":{},\"Task\":{}}}],\"PreviousItems\":null,\"Links\":{}}";
			
			self.sockets.projects.setProjects(body);
//				console.log('Get projects service call successful! Server responded with: ', body);
		});
	};
	
	this.triggerDeploy = function(id) {
		
		console.log('service trigger deploy: ' + id);
		
//		var formData = {
//			projectId: id
//		};
		
		request.post({ url: self.apiBaseUrl + '/TriggerDeploy?projectId=' +id }, function callback(err, httpResponse, body) {
			if (err) {
				return console.error('Trigger deploy service call failed: ', err);
			}
			
				console.log('Trigger deploy service call successful! Server responded with: ', body);
		});
	};
};