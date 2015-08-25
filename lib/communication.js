var Webservices = require('./webservices');
var Websockets = require('./websockets');

module.exports = {

	self: null,
	sockets: null,
	services: null,

	init: function(server) {
		self = this;

		var sockets = new Websockets();
		var services = new Webservices();

		self.services = services;
    self.sockets = sockets;

		self.services.init(self.sockets);
		self.sockets.init(server, self.services);
	},

	attachOutputs: function(outputs) {
		self.sockets.setOutputs(outputs);
	}
};
