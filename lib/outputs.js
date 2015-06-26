//var Gpio = require('onoff').Gpio;

var LPD8806 = require('lpd8806');

module.exports = {
	trigger: function() {
		LPD8806 = new LPD8806(32, '/dev/spidev0.0');
		LPD8806.fillRGB(0, 0, 255);	
	}
};
