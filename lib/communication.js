//var outputs = require('./outputs');
//var request = require('request');
var Webservices = require('./webservices');
var Websockets = require('./websockets');

module.exports = {
	
	self: null,
	sockets: null,
	services: null,
	
	init: function(io) {
		self = this;
		
		var sockets = new Websockets();
		var services = new Webservices();
		
		self.services = services;
    	self.sockets = sockets;
		
		self.services.init(self.sockets);
		self.sockets.init(io, self.services);
	}
	
//	self: null,
//	io: null,
//	
//	init: function (io) {
//		self = this;
//		self.io = io;
//		
//		self.websockets.startServer(io);		
//		
//		setInterval(function() {
//			self.webservices.getBuildStatus();
//		}, 5000);
//	},
//	
//	websockets: {
//		startServer: function(io) {
//			io.on('connection', function(socket) {	
//				self.webservices.getProjects();						
//						
//				socket.on('trigger_deploy', function(id) {
//					console.log('Deploy started');
//					self.webservices.triggerDeploy(id);
//				});
//				
//				socket.on('build_failed', function() {
//					console.log('build failed');
//				});
//				
//			});	
//		},
//		
//		builds: {
//			setStatus: function(statuses) {
//				self.io.emit('status_set', statuses);
//			}
//		},
//		
//		projects: {
//			setProjects: function(projects) {
//				self.io.emit('projects_set', projects);
//			}
//		},
//		
//		inputs: {
//			up: function() {
//				self.io.emit('inputs_up');
//			},
//			down: function() {
//				self.io.emit('inputs_down');
//			},
//			left: function() {
//				self.io.emit('inputs_left');
//			},
//			right: function() {
//				self.io.emit('inputs_right');
//			},
//			button: function() {
//				self.io.emit('inputs_button');
//			}
//		}
//	},
//	
//	webservices: {
//		
//		apiBaseUrl: 'http://deployerservices.local:49530/api/Deployer',
//		
//		getBuildStatus: function() {
//			
//			request.get({ url: self.webservices.apiBaseUrl + '/GetBuildStatus' }, function callback(err, httpResponse, body) {
//				if (err) {
//					return console.error('Get build status service call failed: ', err);
//				}
//				
//				self.websockets.builds.setStatus(body);
//				
////				console.log('Get build status service call successful! Server responded with: ', body);
//			});
//		},
//		
//		getProjects: function(id) {
//			
//			request.get({ url: self.webservices.apiBaseUrl + '/GetDashboard' }, function callback(err, httpResponse, body) {
//				if (err) {
//					return console.error('Get projects service call failed: ', err);
//				}
//				
//				self.websockets.projects.setProjects(body);
//				
////				console.log('Get projects service call successful! Server responded with: ', body);
//			});
//		},
//		
//		triggerDeploy: function(id) {
//			
//			var formData = {
//				projectId: id
//			};
//			
//			request.post({ url: self.webservices.apiBaseUrl + '/TriggerDeploy', formData: formData }, function callback(err, httpResponse, body) {
//				if (err) {
//					return console.error('Trigger deploy service call failed: ', err);
//				}
//				
////				console.log('Trigger deploy service call successful! Server responded with: ', body);
//			});
//		},
//	}
};