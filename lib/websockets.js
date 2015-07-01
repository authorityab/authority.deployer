var outputs = require('./outputs');
//var services = require('./services');

module.exports = function() {	
	var self = null;
	this.io = null;
	this.services = null;
	
	this.init = function (io, webservices) {
		self = this;
		self.io = io;
		self.services = webservices;		
		
		this.startServer(io);		
		
		setInterval(function() {
			self.services.getBuildStatus();
		}, 5000);
	};
	
	this.startServer = function (io) {
		io.on('connection', function(socket) {	
			self.services.getProjects();						
					
			socket.on('trigger_deploy', function(id) {
				console.log('Deploy started: ' + id);
				self.services.triggerDeploy(id);
			});
			
			socket.on('get_deploy_status', function(taskId) {
				self.services.getDeployStatus(taskId);
			});
			
			socket.on('build_failed', function() {
				console.log('build failed');
			});

			socket.on('triggerLights', function() {
				outputs.trigger();
			});

			
		});	
	};
	
	this.tasks = {
		setId: function(taskId) {
			socket.io.emit('set_task_id', taskId);
		}
	}
	
	this.builds = {
		setStatus: function(statuses) {
			self.io.emit('status_set', statuses);
		}
	};
	
	this.projects = {
		setProjects: function(projects) {
			self.io.emit('projects_set', projects);
		}
	};
	
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