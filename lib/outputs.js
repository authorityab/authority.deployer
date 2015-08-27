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
			// self.led.fill(255, 102, 51); //Orange
			// TODO: Maybe remove
			// var colColl = ['00FFFF', 'FF8000', 'FF0080', '00FF00', '8000FF']; //Cyan, Orange, Pink, Lime, Deep Purle
			// self.led.toggle(colColl, 100);
			self.led.pulse('FF8000', 30);
		},
		loading: function() {
			//redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration
			self.ledstrip.stop();
			self.led.animate('808080', 1, -5, 7, 0.015); //Rainbow spiral
		},
		success: function() {
			self.ledstrip.stop();
			self.led.pulse('008000', 30); //Green sprial
		},
		error: function() {
			self.ledstrip.stop();
			self.led.pulse('800000', 30); //Red spiral
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
		this.buttonPin.unexport();
		process.exit();
	}
};
