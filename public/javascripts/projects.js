var Projects = (function() {

	var deployInProgress;

	$(function() {
		Main.socket.emit('get_projects');

		setInterval(function() {
			Main.socket.emit('get_build_status');
		}, 5000);
	});

	Main.socket.on('set_projects', function(data) {
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

	Main.socket.on('set_build_status', function(data) {
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

	Main.socket.on('deploy_started', function(taskId) {

		deployInProgress = setInterval(function () {
			Main.socket.emit('get_deploy_status', taskId);
		}, 500);

	});

	Main.socket.on('set_deploy_status', function(data) {
		var status =  JSON.parse(JSON.parse(data));

		if (status.IsCompleted) {

			clearInterval(deployInProgress);

			if (status.FinishedSuccessfully) {
			}
			else if (status.HasWarningsOrErrors) {
			}
		}

	});

	Main.socket.on('inputs_up', function() {
		console.log('joystick_up');

		var activeItem = $('ul#projects li.active');
		var activeIndex = $('ul#projects li').index(activeItem);

		activeItem.removeClass('active');

		if (activeIndex === 0) {
			$('ul#projects li:last-child').addClass('active');
		} else {
			activeItem.prev('li').addClass('active');
		}
	});

	Main.socket.on('inputs_down', function() {
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
	});

	Main.socket.on('inputs_left', function() {
		console.log('joystick_left');

		$('ul#projects li.active').removeClass('selected');
	});

	Main.socket.on('inputs_right', function() {
		console.log('joystick_right');

	});


	Main.socket.on('inputs_button', function() {

		var projectId = $('ul#projects li.active').data('project-id');

		console.log('joystick_right project id: ' + projectId);

		$('ul#projects li').removeClass('selected');
		$('ul#projects li.active').addClass('selected');

		Main.socket.emit('trigger_deploy', projectId);
	});

})();
