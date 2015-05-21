var socket = io();


$(function() {
	$('ul li:first-child').addClass('active');
	
//	$(document).keydown(function(e) {
//	    switch(e.which) {
//	        case 37: 
////				socket.emit('inputs_left');
////				unselect();
//				$('li.active').toggleClass('selected');
//	        break;
//	
//	        case 38: 
////				socket.emit('inputs_up_test');
//	        	up();
//			break;
//	
//	        case 39: 
////				socket.emit('inputs_right');
////				select();
//				$('li.active').toggleClass('selected');
//	        break;
//	
//	        case 40:
////				socket.emit('inputs_down_test');
//				down();
//	        break;
//	
//	        default: 
//			return;
//	    }
//	    e.preventDefault(); 
//	});
	
});



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
	
	var activeItem = $('li.active');
	var activeIndex = $('ul li').index(activeItem);
	
	activeItem.removeClass('active');
	
	if (activeIndex === 0) {
		$('ul li:last-child').addClass('active');
	} else {
		activeItem.prev('li').addClass('active');
	}
});

socket.on('inputs_down', function() {	
	console.log('joystick_down');
	
	var totalCount = $('ul li').length;
	var activeItem = $('li.active');
	var activeIndex = $('ul li').index(activeItem);
	
	activeItem.removeClass('active');
	
	if (activeIndex === totalCount - 1) {
		$('ul li:first-child').addClass('active');
	} else {
		activeItem.next('li').addClass('active');
	}
});

socket.on('inputs_left', function() {
	console.log('joystick_left');

	$('li.active').removeClass('selected');
});

socket.on('inputs_right', function() {
	console.log('joystick_right');

	$('li.active').addClass('selected');
});

socket.on('inputs_button', function() {
	console.log('button');
});

