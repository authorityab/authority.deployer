var outputs = require('./outputs');

module.exports = function() {
	var self = null;
	this.io = null;
	this.services = null;

	this.init = function (io, webservices) {
		self = this;
		self.io = io;
		self.services = webservices;

		this.startServer(io);


	};

	this.startServer = function (io) {
		io.on('connection', function(socket) {

			socket.on('get_build_status', function() {
				self.builds.getStatus();
			});

			socket.on('get_latest_failed_build', function() {
				self.builds.getLatestFailedBuild();
			});

			socket.on('get_projects', function() {
				self.projects.get();
			});

			socket.on('get_project_info', function(projectId) {
				self.projects.getInfo(projectId);
			});

			socket.on('get_releases', function(projectId) {
				self.releases.get(projectId);
			});

			socket.on('get_environments', function(projectId, releaseId) {
				self.environments.get(projectId, releaseId);
			});

			socket.on('get_latest_deploys', function(projectId) {
				self.deploy.getLatest(projectId);
			});

			socket.on('get_latest_deploy_tasks', function(projectId) {
				self.deploy.getLatestDeployTasks(projectId);
			});



			socket.on('trigger_deploy', function(projectId, releaseId, environmentId) {
				console.log('websockets.js: trigger deploy, project id: ' + projectId);
				console.log('websockets.js: trigger deploy, release id: ' + releaseId);
				console.log('websockets.js: trigger deploy, env id: ' + environmentId);
				self.deploy.trigger(projectId, releaseId, environmentId);
			});

			socket.on('get_deploy_status', function(taskId) {
				self.deploy.getStatus(taskId);
			});

			socket.on('deploy_failed', function() {
				self.deploy.failed();
			});

			socket.on('deploy_succeeded', function() {
				self.deploy.succeeded();
			});

			// TODO: Remove after test
			socket.on('ledstrip_stop', function(){
				outputs.ledstrip.stop();
			});

		});
	};


	this.builds = {
		getLatestFailedBuild: function() {
			self.services.getLatestFailedBuild();
		},
		setLatestFailedBuild: function(build) {
			self.io.emit('set_latest_failed_build', build);
		},
		getStatus: function() {
			self.services.getBuildStatus();
		},
		setStatus: function(statuses) {
			self.io.emit('set_build_status', statuses);
		}
	};

	this.projects = {
		get: function() {
			self.services.getProjects();
		},
		set: function(projects) {
			self.io.emit('set_projects', projects);
		},
		getInfo: function(projectId) {
			self.services.getProjectInfo(projectId);
		},
		setInfo: function(info) {
			self.io.emit('set_project_info', info);
		}
	};

	this.releases = {
		get: function(projectId, releaseId) {
			self.services.getReleases(projectId, releaseId);
		},
		set: function(projects) {
			self.io.emit('set_releases', projects);
		}
	};

	this.environments = {
		get: function(projectId, releaseId) {
			self.services.getEnvironments(projectId, releaseId);
		},
		set: function(environments) {
			self.io.emit('set_environments', environments);
		}
	};

	this.deploy = {
		getLatest: function(projectId) {
			self.services.getLatestDeploys(projectId);
		},
		setLatest: function(deploys) {
			self.io.emit('set_latest_deploys', deploys);
		},
		getLatestDeployTasks: function(projectId) {
			self.services.getLatestDeployTasks(projectId);
		},
		setLatestDeployTasks: function(tasks) {
			self.io.emit('set_latest_deploy_tasks', tasks);
		},
		trigger: function(projectId, releaseId, environmentId) {
			console.log('project id: ' + projectId);
	    console.log('release id: ' + releaseId);
	    console.log('environment id: ' + environmentId);
			outputs.ledstrip.loading();
		  self.services.triggerDeploy(projectId, releaseId, environmentId);
		},
		getStatus: function(taskId) {
			self.services.getDeployStatus(taskId);
		},
		setStatus: function(status) {
			self.io.emit('set_deploy_status', status);
		},
		started: function(taskId) {
			self.io.emit('deploy_started', taskId);
		},
		failed: function(taskId) {
			outputs.ledstrip.stop();
			outputs.ledstrip.error();
		},
		succeeded: function(taskId) {
			outputs.ledstrip.stop();
			outputs.ledstrip.success();
		}
	}

	this.inputs = {

		up: function() {
			console.log('INPUTS');
			self.io.emit('inputs_up');
		},
		down: function() {
			self.io.emit('inputs_down');
		},
		left: function() {
			self.io.emit('inputs_left');
		},
		right: function() {
			self.io.emit('inputs_right');
		},
		button: function() {
			self.io.emit('inputs_button');
		}
	};
};
