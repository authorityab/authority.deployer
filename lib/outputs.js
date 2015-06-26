//var Gpio = require('onoff').Gpio;

var LPD8806 = require('lpd8806'),
 Animations = require('./lib/Animations')

module.exports = {
	trigger: function() {
		strip = new LPD8806(32, '/dev/spidev0.0');

		//LPD8806.setPixelColor(1, LPD8806.color(255, 0, 0));

		Animations = new Animations(32);
		while(true){
			Animations.Rainbow(strip);
			strip.allOFF();
		}
		//Animations.Colors(LPD8806, 0.01);
	}
};
