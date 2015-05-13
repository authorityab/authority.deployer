//var Gpio = require('onoff').Gpio;

//var joystick = new Gpio(4, 'in', 'both');

module.exports = function(io) {
	
	io.sockets.emit('status', { status: 'joystick status' });
	
	//joystick.watch(function(err, value) |
	//	led.writeSync(value);
	//)
	console.log('joystick');
};

