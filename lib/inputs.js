var sockets = require('./websockets');
var Gpio = require('onoff').Gpio;

var joystick_up = new Gpio(27, 'in', 'both'); //rising
var joystick_down= new Gpio(17, 'in', 'both');
var joystick_left = new Gpio(6, 'in', 'both');
var joystick_right = new Gpio(5, 'in', 'both');

//var button = new Gpio(4, 'in', 'falling');



module.exports = (function() {
	
	console.log('loaded inputs');
	
	joystick_up.watch(function(err, value) {
		if (err) {
			throw err;
		}
		
		console.log('joystick_up');
		sockets.inputs.up();
	});
	
	joystick_down.watch(function(err, value) {
		if (err) {
			throw err;
		}
		
		console.log('joystick_down');
		sockets.inputs.down();
	});
	
	joystick_left.watch(function(err, value) {
		if (err) {
			throw err;
		}
		
		console.log('joystick_left');
		sockets.inputs.left();
	});
	
	joystick_right.watch(function(err, value) {
		if (err) {
			throw err;
		}
		
		console.log('joystick_right');
		sockets.inputs.right();
	});
		
//		button.watch(function(err, value) {
//			sockets.inputs.button();
//		});

	function exit() {
		joystick_up.unexport();
		joystick_down.unexport();
		joystick_left.unexport();
		joystick_right.unexport();
//		button.unexport();

		process.exit();
	}

	process.on('SIGINT', exit);
	
})();

