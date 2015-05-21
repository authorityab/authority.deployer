var sockets = require('./websockets');
var Gpio = require('onoff').Gpio;

var joystick_up = new Gpio(6, 'in', 'falling'); //rising
var joystick_down= new Gpio(5, 'in', 'falling');
var joystick_left = new Gpio(26, 'in', 'falling'); // only gpio pns 4,5,6 are working
var joystick_right = new Gpio(4, 'in', 'falling');

var lock_up = false;
var lock_down = false;
var lock_left = false;
var lock_right = false;


//var button = new Gpio(4, 'in', 'falling');



module.exports = (function() {
	
	joystick_up.watch(function(err, value) {
		if (err) {
			throw err;
		}
		
		if (value === 1 && !lock_up) {
			lock_up = true;
			lock_down = false;
			lock_left = false;
			lock_right = false;
			
			setTimeout(function() {
				lock_up = false;
			}, 500);
			
			console.log('joystick_up value: ' + value);
			sockets.inputs.up();
		}
		
	});
	
	joystick_down.watch(function(err, value) {
		if (err) {
			throw err;
		}
		
		if (value === 1 && !lock_down) {
			lock_up = false;
			lock_down = true;
			lock_left = false;
			lock_right = false;
			
			setTimeout(function() {
				lock_down = false;
			}, 500);
			
			console.log('joystick_down value: ' + value);
			sockets.inputs.down();
		}
	});
	
	joystick_left.watch(function(err, value) {
		if (err) {
			throw err;
		}
		
		if (value === 1 && !lock_left) {
			lock_up = false;
			lock_down = false;
			lock_left = true;
			lock_right = false;
			
			setTimeout(function() {
				lock_left = false;
			}, 500);
			
			console.log('joystick_left value: ' + value);	
			sockets.inputs.left();
		}
		
	});
	
	joystick_right.watch(function(err, value) {
		if (err) {
			throw err;
		}

		
		if (value === 1 && !lock_right) {
			lock_up = false;
			lock_down = false;
			lock_left = false;
			lock_right = true;
			
			setTimeout(function() {
				lock_right = false;
			}, 500);
			
			console.log('joystick_right value: ' + value);
			sockets.inputs.right();
		}
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

