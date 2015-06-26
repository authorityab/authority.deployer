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
};