var socket = io();

socket.on('status_set', function(data) {	
	var list = $('ul li');
	var d = JSON.parse(data);
	
	for (var i = 0; i < list.length; i++) {
		var listItem = $(list[i]);
		for (var y = 0; y < d.projects.length; y++) {
			var project = d.projects[y];
			if (listItem.data('id') == project.id) {
				listItem.attr('class', project.status == 1 ? "success" : "error");
			}
		}
	}
});

socket.on('inputs_up', function() {
	console.log('joystick_up');
});

socket.on('inputs_down', function() {
	console.log('joystick_down');
});

socket.on('inputs_left', function() {
	console.log('joystick_left');
});

socket.on('inputs_right', function() {
	console.log('joystick_right');
});

socket.on('inputs_button', function() {
	console.log('button');
});

