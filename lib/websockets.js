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

			socket.on('trigger_deploy', function(id) {
				console.log('trigger deploy');
				self.deploy.trigger(id);
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
		}
	};

	this.deploy = {
		trigger: function(id) {
			console.log('Deploy started: ' + id);
			outputs.ledstrip.loading();
		//	self.services.triggerDeploy(id);
		},
		getStatus: function(taskId) {
			self.services.getDeployStatus(taskId);
		},
		setStatus: function(status) {
			socket.io.emit('set_deploy_status', status);
		},
		started: function(taskId) {
			socket.io.emit('deploy_started', taskId);
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
