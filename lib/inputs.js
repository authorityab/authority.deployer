module.exports = function() {
	var self = null;
	this.Gpio = null;
	this.joystick_up = null;
	this.joystick_down = null;
	this.joystick_left = null;
	this.joystick_right = null;
	this.button_pushed = null;
	this.lock_up = false;
	this.lock_down = false;
	this.lock_left = false;
	this.lock_right = false;
	this.lock_button = false;
	this.lock_time = 300;

	this.init = function(communication) {
		self = this;

		console.log('inputs init');

		this.Gpio = require('onoff').Gpio;
		this.com = communication;
		this.joystick_up = new self.Gpio(6, 'in', 'falling'); //rising;
		this.joystick_down = new self.Gpio(5, 'in', 'falling');
		this.joystick_left = new self.Gpio(19, 'in', 'falling');
		this.joystick_right = new self.Gpio(13, 'in', 'falling');
		this.button_pushed =  new self.Gpio(21, 'in', 'rising');

		process.on('SIGINT', this.exit);

		this.attachListeners();
	};

	this.attachListeners = function() {
		this.joystick_up.watch(function(err, value) {
			console.log('up inputs');
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

		this.joystick_down.watch(function(err, value) {
			console.log('down inputs');
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

		this.joystick_left.watch(function(err, value) {
			console.log('left inputs');
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

		this.joystick_right.watch(function(err, value) {
			console.log('right inputs');
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

		this.button_pushed.watch(function(err, value) {
			console.log('button inputs');
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
	};

	this.exit = function() {
		//TODO: Fred är lack, fixa
		self.joystick_up.unexport();
		self.joystick_down.unexport();
		self.joystick_left.unexport();
		self.joystick_right.unexport();
		self.button_pushed.unexport();

		process.exit();
	};
};
