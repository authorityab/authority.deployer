

module.exports = {

// io: null,
//
//create: function(http) {
	
	
//	io.on('inputStat', function(input) {
//		console.log('input received: ' + input);
//	});
	
	io: null,

	startServer: function(io) {
		io.on('connection', function(socket) {
			console.log('-- connected --');	
			
	//		var stat = { status: 'input status' };
			
			
	//		console.log(io);
	//		io.emit('inputStat', 'input connected');
			
//			socket.emit('status', { status: 'joystick status' });
			
			socket.on('test', function(input) {
				console.log('test received: ' + input);
			});
			
			socket.on('send', function(input) {
				console.log('send received: ' + input);
			});
	//		
//			socket.emit('test', 'inline stat');
			
			
		});	
		
//		io.sockets.on('test', function(input) {
//			console.log('input received: ' + input);
//		});
		
		this.io = io;
	},
	
	setStatus: function(projects) {
		this.io.emit('setStatus', projects);
		
//		console.log(this.io);
//		console.log('message: ' +  msg);
	}
	
	
	
//	
	
	
	
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