var led = require('./ledstrip');
led.init();

module.exports = {
	ledstrip: {
		loading: function() {
			led.animate(128, 128, 128, 1, -5, 7 0.005);
		},
	
		success: function() {
			led.animate(0, 128, 0, 0.105, 0, 1, 0, 5000);
		},
	
		error: function() {
			led.animate(128, 0, 0, 0.105, 1, 0, 0 5000);
		},
	
		stop: function() {
			led.disconnect();
		}
	},
	
	button: {
	
	}
};
