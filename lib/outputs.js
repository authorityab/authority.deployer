var led = require('./ledstrip');
led.init();

module.exports = {
	ledstrip: {

		loading: function() {
			//redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration
			led.animate(128, 128, 128, 1, -5, 7, 0.055);
		},
	
		success: function() {
			//redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration
			led.animate(0, 128, 0, 0, 1, 0, 0.105, 5000);
		},
	
		error: function() {
			//redVal, greenVal, blueVal, redAngAmp, greenAngAmp, blueAngAmp, animationTick, duration
			led.animate(128, 0, 0, 1, 0, 0, 0.105, 5000);
		},
	
		stop: function() {
			led.disconnect();
		}
	},
	
	button: {
	
	}
};
