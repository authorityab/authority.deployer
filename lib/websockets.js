var sockets = require('socket.io');

module.exports = function() {
	var self = null;
	this.io = null;
	this.services = null;
	this.outputs = null;

	this.init = function (server, webservices) {
		self = this;
		self.io = sockets(server);
		self.services = webservices;

		this.attachEvents();
	};

	this.setOutputs = function(outputs) {
		self.outputs = outputs
	};

	this.execOutputFunc = function(namespace, func) {
		if (self.outputs === null) {
			return false;
		}

		// Semi hack...
		self.outputs[namespace][func]();
	}

	this.attachEvents = function () {
		self.io.on('connection', function(socket) {

			socket.on('get_build_status', function(hollaback) {
				self.services.getBuildStatus(hollaback);
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
				self.execOutputFunc('ledstrip', 'stop');
				self.execOutputFunc('ledstrip', 'error');
			});

			socket.on('deploy_succeeded', function() {
				self.execOutputFunc('ledstrip', 'stop');
				self.execOutputFunc('ledstrip', 'success');
			});

			socket.on('arm_deploy_button', function() {
				self.execOutputFunc('button', 'arm');
			});

			socket.on('disarm_deploy_button', function() {
				self.execOutputFunc('button', 'disarm');
			});
		});
	};

	this.deploy = {
		setStatus: function(status) {
			self.io.volatile.emit('set_deploy_status', status);
		},
		started: function(taskId) {
			self.io.volatile.emit('deploy_started', taskId);
		}
	};

	this.inputs = {
		up: function() {
			self.io.volatile.emit('inputs_up');
		},
		down: function() {
			self.io.volatile.emit('inputs_down');
		},
		left: function() {
			self.io.volatile.emit('inputs_left');
		},
		right: function() {
			self.io.volatile.emit('inputs_right');
		},
		button: function() {
			self.io.volatile.emit('inputs_button');
		}
	};
};
