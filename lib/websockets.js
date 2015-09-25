var sockets = require('socket.io');

module.exports = function() {
	var self = null;
	this.io = null;
	this.socket = null;
	this.services = null;
	this.outputs = null;

	this.init = function (server, webservices) {
		self = this;

		this.io = sockets(server);
		this.services = webservices;

		this.attachEvents();
	};

	this.setOutputs = function(outputs) {
		this.outputs = outputs
	};

	// Semi hack...
	this.execOutputFunc = function(namespace, func) {
		if (this.outputs === null) {
			return false;
		}

		this.outputs[namespace][func]();
	}

	this.attachEvents = function () {
		this.io.on('connection', function(socket) {

			self.socket = socket;

			socket.on('get_builds', function(hollaback) {
				self.services.getBuilds(hollaback);
			});

			socket.on('get_latest_failed_build', function(hollaback) {
				self.services.getLatestFailedBuild(hollaback);
			});

			socket.on('get_projects', function(hollaback) {
				self.services.getProjects(hollaback);
			});

			socket.on('get_releases', function(projectId, hollaback) {
				self.services.getReleases(projectId, hollaback);
			});

			socket.on('get_environments', function(data, hollaback) {
				self.services.getEnvironments(data.projectId, data.releaseId, hollaback);
			});

			socket.on('trigger_deploy', function(data) {
				self.execOutputFunc('ledstrip', 'loading');
		  	self.services.triggerDeploy(data.projectId, data.releaseId, data.environmentId);
			});

			socket.on('get_deploy_status', function(taskId) {
				self.services.getDeployStatus(taskId);
			});

			socket.on('deploy_failed', function() {
				self.execOutputFunc('ledstrip', 'error');
			});

			socket.on('deploy_succeeded', function() {
				self.execOutputFunc('ledstrip', 'success');
			});

			socket.on('arm_deploy_button', function() {
				self.execOutputFunc('button', 'arm');
				self.execOutputFunc('ledstrip', 'arm');
			});

			socket.on('disarm_deploy_button', function() {
				self.execOutputFunc('button', 'disarm');
				self.execOutputFunc('ledstrip', 'stop');
			});
		});
	};

	this.builds = {
		set: function(builds, hollaback) {
			self.socket.volatile.emit('set_builds', builds, hollaback);
		},
		setLatest: function(build, hollaback) {
			self.socket.volatile.emit('set_latest_build', build, hollaback);
		},
		setLatestFailed: function(build, hollaback) {
			self.socket.volatile.emit('set_latest_failed_build', build, hollaback);
		}
	},

	this.deploy = {
		setStatus: function(status) {
			self.socket.volatile.emit('set_deploy_status', status);
		},
		started: function(taskId) {
			self.socket.volatile.emit('deploy_started', taskId);
		}
	};

	this.inputs = {
		up: function() {
			self.socket.volatile.emit('inputs_up');
		},
		down: function() {
			self.socket.volatile.emit('inputs_down');
		},
		left: function() {
			self.socket.volatile.emit('inputs_left');
		},
		right: function() {
			self.socket.volatile.emit('inputs_right');
		},
		button: function() {
			self.socket.volatile.emit('inputs_button');
		}
	};
};
