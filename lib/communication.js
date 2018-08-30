var Webservices = require('./webservices');
var Websockets = require('./websockets');

var self;
var sockets;
var services;

module.exports = {

	init: function(server) {
		self = this;

		self.services = new Webservices();
    self.sockets = new Websockets();

		self.services.init(self.sockets);
		self.sockets.init(server, self.services);
	},

	attachOutputs: function(outputs) {
		self.sockets.attachOutputs(outputs);
	}

};
