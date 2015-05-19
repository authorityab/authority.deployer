
var services = require('./services');

module.exports = {
	
	self: null,
	io: null,

	startServer: function(io) {
		io.on('connection', function(socket) {			
			socket.on('trigger_deploy', function(id) {
				console.log('Deploy started');
				services.triggerDeploy(id);
			});
		});	
		
		self = this;
		self.io = io;
	},
	
	status: {
		set: function(projects) {
			self.io.emit('status_set', projects);
		}
	},
	
	inputs: {
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
	}	
		
};