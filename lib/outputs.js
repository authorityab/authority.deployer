var led = require('./ledstrip');

module.exports = {
	var ledstrippa = new led.Ledstrip();
    ledstrippa.connect();
    ledstrippa.fill(0x00, 0x00, 0x00);
   
	ledstrip: {
		loading: function() {
			ledstrippa.animate(128, 128, 128, 0.005);
		},
	
		success: function() {
			ledstrippa.animate(0, 128, 0, 0.1, 5000);
		},
	
		error: function() {
			ledstrippa.animate(128, 0, 0, 0.1, 5000);
		},
	
		stop: function() {
			ledstrippa.disconnect();
		}
	},
	
	button: {
	
	}

};
