// var com = require('./communication');
//


module.exports = function() {
	var self = null;
	var Gpio = null;
	var com = null;
	var joystick_up = null;
	var joystick_down = null;
	var joystick_left = null;
	var joystick_right = null;
	var button_pushed = null;
	var lock_up, lock_down, lock_left, lock_right, lock_button = false;



	this.init = function() {
		self = this;
		self.Gpio = require('onoff').Gpio;
		self.com = require('./communication');
		self.joystick_up = new self.Gpio(6, 'in', 'falling'); //rising;
		self.joystick_down = new self.Gpio(5, 'in', 'falling');
		self.joystick_left = new self.Gpio(19, 'in', 'falling');
		self.joystick_right = new self.Gpio(13, 'in', 'falling');
		self.button_pushed =  new self.Gpio(21, 'in', 'rising');

		self.com.sockets.inputs.up();

		// var Gpio = require('onoff').Gpio;
		// var joystick_up = new Gpio(6, 'in', 'falling'); //rising
		// var joystick_down= new Gpio(5, 'in', 'falling');
		// var joystick_left = new Gpio(19, 'in', 'falling');
		// var joystick_right = new Gpio(13, 'in', 'falling');
		//
		// var button_pushed = new Gpio(21, 'in', 'rising');
		//
		// var lock_up, lock_down, lock_left, lock_right, lock_button = false;
		// var lock_time = 300;

		// joystick_up.watch(function(err, value) {
		// 	if (err) {
		// 		throw err;
		// 	}
		//
		// 	if (value === 1 && !lock_up) {
		// 		lock_up = true;
		// 		lock_down = false;
		// 		lock_left = false;
		// 		lock_right = false;
		//
		// 		setTimeout(function() {
		// 			lock_up = false;
		// 		}, lock_time);
		//
		// 		com.sockets.inputs.up();
		// 	}
		//
		// });
		//
		// joystick_down.watch(function(err, value) {
		// 	if (err) {
		// 		throw err;
		// 	}
		//
		// 	if (value === 1 && !lock_down) {
		// 		lock_up = false;
		// 		lock_down = true;
		// 		lock_left = false;
		// 		lock_right = false;
		//
		// 		setTimeout(function() {
		// 			lock_down = false;
		// 		}, lock_time);
		//
		// 		com.sockets.inputs.down();
		// 	}
		// });
		//
		// joystick_left.watch(function(err, value) {
		// 	if (err) {
		// 		throw err;
		// 	}
		//
		// 	if (value === 1 && !lock_left) {
		// 		lock_up = false;
		// 		lock_down = false;
		// 		lock_left = true;
		// 		lock_right = false;
		//
		// 		setTimeout(function() {
		// 			lock_left = false;
		// 		}, lock_time);
		//
		// 		com.sockets.inputs.left();
		// 	}
		// });
		//
		// joystick_right.watch(function(err, value) {
		// 	if (err) {
		// 		throw err;
		// 	}
		//
		// 	if (value === 1 && !lock_right) {
		// 		lock_up = false;
		// 		lock_down = false;
		// 		lock_left = false;
		// 		lock_right = true;
		//
		// 		setTimeout(function() {
		// 			lock_right = false;
		// 		}, lock_time);
		//
		// 		com.sockets.inputs.right();
		// 	}
		// });
		//
		// button_pushed.watch(function(err, value) {
		// 	if (err) {
		// 		throw err;
		// 	}
		//
		// 	if(value == 0 && !lock_button){
		// 		com.sockets.inputs.button();
		// 		lock_button = true;
		//
		// 		setTimeout(function(){
		// 			lock_button = false;
		// 		}, lock_time);
		// 	}
		// });
		//
		// process.on('SIGINT', exit);

	},

	this.exit = function() {
		self.joystick_up.unexport();
		self.joystick_down.unexport();
		self.joystick_left.unexport();
		self.joystick_right.unexport();
		self.button_pushed.unexport();

		process.exit();
	}
};
