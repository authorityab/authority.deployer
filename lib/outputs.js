//var Gpio = require('onoff').Gpio;

var LPD8806 = require('lpd8806')

module.exports = {
	trigger: function() {
		strip = new LPD8806(32, '/dev/spidev0.0');

		//LPD8806.setPixelColor(1, LPD8806.color(255, 0, 0));

		Animations = new Animations(32);
		var _step = 0;
		ledCount = 32;

		setInterval(function(){
			for(var i = 0; i < 384; i++){
		        var amt = 1;
		        for(var p = 0; p < ledCount; p++){
		            var color = (p + _step) % 384;
		            LPD8806.setPixel(start + p, LPD8806.wheel_color(color));
		        }
		        LPD8806.update();

		        _step += amt;
		        var overflow = _step - 384;
		        if(overflow >= 0){
		            _step = overflow;
		        }
	        }
	    }, 2000);
		        
		strip.allOFF();
	}
	//Animations.Colors(LPD8806, 0.01);
};
