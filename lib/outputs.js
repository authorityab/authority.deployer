module.exports = function() {
	var self = null;
	this.led = null;
	this.Gpio = null;
	this.buttonPin = null;

	this.init = function () {
		self = this;

		this.led = require('./ledstrip');
		this.Gpio = require('onoff').Gpio;
		this.buttonPin = new self.Gpio(12, 'out');

		this.led.init();
		this.button.disarm();

		process.on('SIGINT', this.exit);
	},

	this.ledstrip = {
		arm: function() {
			self.ledstrip.stop();
			self.ledstrip.fill(255, 102, 51); //Orange
		},
		loading: function() {
			//redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration
			self.ledstrip.stop();
			self.led.animate(128, 128, 128, 1, -5, 7, 0.015); //Rainbow spiral
		},
		success: function() {
			self.ledstrip.stop();
			self.led.animate(0, 128, 0, 0, 1, 0, 0.105, 5000); //Green sprial
		},
		error: function() {
			self.ledstrip.stop();
			self.led.animate(128, 0, 0, 1, 0, 0, 0.105, 5000); //Red spiral
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
		this.buttonPin.unexport();
		process.exit();
	}
};
