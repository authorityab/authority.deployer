

var sockets = require('./websockets');

// TODO: Uncomment when using on raspberry
//var Gpio = require('onoff').Gpio;
//var joystick = new Gpio(4, 'in', 'both');



module.exports = function() {

		
	
	
	console.log('inputs loaded');
	
//	joystick.watch(function(err, value) {
//		led.writeSync(value);
		sockets.send('function test 2');
//	});
};

