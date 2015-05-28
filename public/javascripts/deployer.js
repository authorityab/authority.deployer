var socket = io();


$(function() {
	
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

socket.on('projects_set', function(data) {
	var list = $('ul#projects');
	list.empty();
	
	// TODO: If from c# must double parse;
	var dashboard =  JSON.parse(data); //JSON.parse(JSON.parse(data));
	for (var i = 0; i < dashboard.Projects.length; i++) {
		var project = dashboard.Projects[i];
		var environment = dashboard.Environments[0];
		
		var success;
		for (var y = 0; y < dashboard.Items.length; y++) {
			if (dashboard.Items[y].ProjectId === project.Id) {
				success = !dashboard.Items[y].HasPendingInterruptions && !dashboard.Items[y].HasWarningsOrErrors;
			}
		}
		
		var listItem = $('<li>' + project.Name + ' - ' + environment.Name + '</li>');
		listItem.attr('class', success ? "success" : "error");
		
		list.append(listItem);
	}
	
	list.find('li:first-child').addClass('active');
	
});

socket.on('status_set', function(data) {	
	var list = $('ul#build-statuses');
	list.empty();
	
	var statuses = JSON.parse(JSON.parse(data));
	for (var i = 0; i < statuses.length; i++) {
		var status = statuses[i];
		var listItem = $('<li>' + status.ProjectName + '</li>');
		listItem.attr('class', status.BuildStatus == 1 ? "success" : "error");
		list.append(listItem);
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

	$('ul li').removeClass('selected');
	$('li.active').addClass('selected');
});

socket.on('inputs_button', function() {
	console.log('button');
});

