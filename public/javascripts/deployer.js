var socket = io();

$(function() {
	
	socket.triggerLights();

	$(document).keydown(function(e) {
	    switch(e.which) {
	        case 37: 
//				socket.emit('inputs_left');
//				unselect();
//				$('li.active').toggleClass('selected');
				left();
	        break;
	
	        case 38: 
//				socket.emit('inputs_up_test');
	        	up();
			break;
	
	        case 39: 
//				socket.emit('inputs_right');
//				select();
//				$('li.active').toggleClass('selected');
				right();
	        break;
	
	        case 40:
//				socket.emit('inputs_down_test');
				down();
	        break;
	
	        default: 
			return;
	    }
	    e.preventDefault(); 
	});
	
});

socket.on('projects_set', function(data) {
	var list = $('ul#projects');
	list.empty();
	
	// TODO: If from c# must double parse;
	var dashboard =  JSON.parse(JSON.parse(data));
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
		listItem.attr('data-project-id', project.Id);
		
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

function up() {
	

//socket.on('inputs_up', function() {	
	console.log('joystick_up');
	
	var activeItem = $('ul#projects li.active');
	var activeIndex = $('ul#projects li').index(activeItem);
	
	activeItem.removeClass('active');
	
	if (activeIndex === 0) {
		$('ul#projects li:last-child').addClass('active');
	} else {
		activeItem.prev('li').addClass('active');
	}
//});
}

function down() {
	
//socket.on('inputs_down', function() {	
	console.log('joystick_down');
	
	var totalCount = $('ul#projects li').length;
	var activeItem = $('ul#projects li.active');
	var activeIndex = $('ul#projects li').index(activeItem);
	
	activeItem.removeClass('active');
	
	if (activeIndex === totalCount - 1) {
		$('ul#projects li:first-child').addClass('active');
	} else {
		activeItem.next('li').addClass('active');
	}
//});
}

function left() {
	
//socket.on('inputs_left', function() {
	console.log('joystick_left');

	$('ul#projects li.active').removeClass('selected');
//});
}

function right() {
//socket.on('inputs_right', function() {

// TODO: Send project id to Service
	var projectId = $('ul#projects li.active').data('project-id');
	
	console.log('joystick_right');
	console.log('joystick_right project id: ' + projectId);

	$('ul#projects li').removeClass('selected');
	$('ul#projects li.active').addClass('selected');
	
	
	
	socket.emit('trigger_deploy', projectId);
//});
}


socket.on('inputs_button', function() {
	console.log('button');
});

