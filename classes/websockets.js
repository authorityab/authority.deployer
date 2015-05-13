

module.exports = function(io){

// io: null,
//
//create: function(http) {
	
	
	io.sockets.on('connection', function(socket) {
		console.log('-- user connected --');	
		
		
		
		
		
	});
	
	io.sockets.on('status', function(status) {
		console.log('status received: ' + status);
	});
	
//	console.log(this.io);
//},
	//io.on('connection', function(socket) {
	//	console.log('-- user connected --');
	//});
	
//};

//var io = require('socket.io')(http);
	
//sendStatus: function(status) {
//		
//		this.io.emit('status', { status: status });
//		
//		console.log(this.io);
//		
//		console.log('sendStatus: ' + status);
//}	
//	
	
};