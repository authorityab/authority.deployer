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
			self.ledstrip.stop
			self.led.fillHex('FF8000'); //Orange
			// self.led.pulseShift(['00FFFF', 'FF8000', 'FF0080', '00FF00', '8000FF'], 30);
		},
		loading: function() {
			self.ledstrip.stop();
			self.led.pulse('FFFFFF', 20); //White fast pulse
		},
		inProgress: function() {
			//redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration
			self.ledstrip.stop();
			self.led.animate('808080', 1, -5, 7, 0.015); //Rainbow spiral
		},
		success: function() {
			self.ledstrip.stop();
			self.led.pulse('008000', 30); //Green pulse
		},
		error: function() {
			self.ledstrip.stop();
			self.led.pulse('800000', 30); //Red pulse
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
		//TODO: Fred är lack, fixa
		self.buttonPin.unexport();
		process.exit();
	}

};
