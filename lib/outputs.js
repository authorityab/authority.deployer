var led = require('./ledstrip');
var Gpio = require('onoff').Gpio;
var buttonPin = new Gpio(12, 'out');
led.init();

module.exports = {
	ledstrip: {

		loading: function() {
			//redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration
			led.animate(128, 128, 128, 1, -5, 7, 0.015);
		},

		success: function() {
			led.animate(0, 128, 0, 0, 1, 0, 0.105, 5000);
		},

		error: function() {
			led.animate(128, 0, 0, 1, 0, 0, 0.105, 5000);
		},

		stop: function() {
			led.disconnect();
		}
	},

	button: {
		arm: function() {
			buttonPin.writeSync(0);
		},

		disarm: function() {
			buttonPin.writeSync(1);
		}
	},

	exit: function() {
		buttonPin.unexport();
		process.exit();
	}

	process.on('SIGINT', exit);

};
