var Gpio = require('onoff').Gpio;

var led = require('./ledstrip');
led.init();

var buttonPin = new Gpio(12, 'out');


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
			console.log('output arm button');
			buttonPin.write(1);
		},

		disarm: function() {
			buttonPin.write(0);
		}
	}
};
