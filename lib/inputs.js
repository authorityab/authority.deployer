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
	var lock_time = 300;



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
		console.log('inputs loaded');


		self.joystick_up.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if (value === 1 && !self.lock_up) {
				self.lock_up = true;
				self.lock_down = false;
				self.lock_left = false;
				self.lock_right = false;

				setTimeout(function() {
					self.lock_up = false;
				}, self.lock_time);

				self.com.sockets.inputs.up();
			}

		});

		self.joystick_down.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if (value === 1 && !self.lock_down) {
				self.lock_up = false;
				self.lock_down = true;
				self.lock_left = false;
				self.lock_right = false;

				setTimeout(function() {
					self.lock_down = false;
				}, self.lock_time);

				self.com.sockets.inputs.down();
			}
		});

		joystick_left.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if (value === 1 && !self.lock_left) {
				self.lock_up = false;
				self.lock_down = false;
				self.lock_left = true;
				self.lock_right = false;

				setTimeout(function() {
					self.lock_left = false;
				}, self.lock_time);

				self.com.sockets.inputs.left();
			}
		});

		self.joystick_right.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if (value === 1 && !self.lock_right) {
				self.lock_up = false;
				self.lock_down = false;
				self.lock_left = false;
				self.lock_right = true;

				setTimeout(function() {
					self.lock_right = false;
				}, self.lock_time);

				self.com.sockets.inputs.right();
			}
		});

		self.button_pushed.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if(value == 0 && !self.lock_button){
				self.com.sockets.inputs.button();
				self.lock_button = true;

				setTimeout(function(){
					self.lock_button = false;
				}, self.lock_time);
			}
		});
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
