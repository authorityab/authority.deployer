module.exports = function() {
	var self = null;
	this.led = null;
	this.Gpio = null;
	this.buttonPin = null;

	this.init = function () {
		self = this;
		self.led = require('./ledstrip');
		self.Gpio = require('onoff').Gpio;
		self.buttonPin = new self.Gpio(12, 'out');

		self.led.init();
		self.button.disarm();
		process.on('SIGINT', self.exit);

		console.log('outputs loaded');

		self.ledstrip.loading();
	},

	this.ledstrip = {
		loading: function() {
			//redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration
			self.led.animate(128, 128, 128, 1, -5, 7, 0.015);
		},

		success: function() {
			self.led.animate(0, 128, 0, 0, 1, 0, 0.105, 5000);
		},

		error: function() {
			self.led.animate(128, 0, 0, 1, 0, 0, 0.105, 5000);
		},

		stop: function() {
			self.led.disconnect();
		}
	},

	this.button = {
		arm: function() {
			self.buttonPin.writeSync(0);
		},

		disarm: function() {
			self.buttonPin.writeSync(1);
		}
	},

	this.exit = function() {
		self.buttonPin.unexport();
		process.exit();
	}
};
