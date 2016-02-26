module.exports = function() {
	var self = null;
	this.Gpio = null;
	this.joystick_up = null;
	this.joystick_down = null;
	this.joystick_left = null;
	this.joystick_right = null;
	this.button_pushed = null;

	this.joystickLocks = [
			{ name: 'up', isLocked: false },
			{ name: 'down', isLocked: false },
			{ name: 'left', isLocked: false },
			{ name: 'right', isLocked: false },
	];

	this.lock_button = false;
	this.lock_time = 300;

	this.init = function(communication) {
		self = this;

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
			if (err) {
				throw err;
			}

			if (value === 1 && !self.lock_up) {
				self.lockJoystick('up');
				console.log('inputs up');

				setTimeout(function() {
					self.unlockJoystick();
				}, self.lock_time);

				self.com.sockets.inputs.up();
			}
		});

		this.joystick_down.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if (value === 1 && !self.lock_down) {
				self.lockJoystick('down');
				console.log('inputs down');

				setTimeout(function() {
					self.unlockJoystick();
				}, self.lock_time);

				self.com.sockets.inputs.down();
			}
		});

		this.joystick_left.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if (value === 1 && !self.lock_left) {
				self.lockJoystick('left');
				console.log('inputs left');

				setTimeout(function() {
					self.unlockJoystick();
				}, self.lock_time);

				self.com.sockets.inputs.left();
			}
		});

		this.joystick_right.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if (value === 1 && !self.lock_right) {
				self.lockJoystick('right');
				console.log('inputs right');

				setTimeout(function() {
					self.unlockJoystick();
				}, self.lock_time);

				self.com.sockets.inputs.right();
			}
		});

		this.button_pushed.watch(function(err, value) {
			if (err) {
				throw err;
			}

			if(value == 0 && !self.lock_button){
				console.log('inputs button');
				self.com.sockets.inputs.button();
				self.lock_button = true;

				setTimeout(function(){
					self.lock_button = false;
				}, self.lock_time);
			}
		});
	};

	this.lockJoystick = function(input) {
		for(var i = 0; i < self.joystickLocks.length; i++) {
			var lock = self.joystickLocks[i];
			if (lock.name === input) {
				lock.isLocked = true;
			} else {
				lock.isLocked = false;
			}
		}
	};

	this.unlockJoystick = function() {
		for(var i = 0; i < self.joystickLocks.length; i++) {
			var lock = self.joystickLocks[i];
			lock.isLocked = false;
		}
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
