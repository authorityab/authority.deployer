var sockets = require('./websockets');
var Gpio = require('onoff').Gpio;

var joystick_up = new Gpio(27, 'in');
var joystick_down= new Gpio(17, 'in');
var joystick_left = new Gpio(6, 'in');
var joystick_right = new Gpio(5, 'in');

//var button = new Gpio(4, 'in');



module.exports = {
	
	init: function() {
		joystick_up.watch(function(err, value) {
			sockets.inputs.up();
		});
		
		joystick_down.watch(function(err, value) {
			sockets.inputs.down();
		});
		
		joystick_left.watch(function(err, value) {
			sockets.inputs.left();
		});
		
		joystick_right.watch(function(err, value) {
			sockets.inputs.right();
		});
		
//		button.watch(function(err, value) {
//			sockets.inputs.button();
//		});
	}
};

