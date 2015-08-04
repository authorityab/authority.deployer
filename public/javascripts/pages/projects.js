var Projects = (function() {

	var deployInProgress;


	$(function() {

		//TODO: Remove after test
		$(document).unbind();
		$(document).keydown(function(e) {
	    switch(e.which) {
					case 13: // enter
					triggerDeploy();
					console.log('e');
					break;

	        case 37: // left
					left();
					console.log('l');
	        break;

					case 38: // up
					up();
					console.log('u');
	        break;

	        case 39: // right
					right();
					console.log('r');
	        break;

					case 40: // down
					down();
					console.log('d');
	        break;

	        default: return;
	    }
    	e.preventDefault();
		});




		Main.socket.emit('get_projects');




	});



















	Main.socket.on('set_projects', function(data) {
		var list = $('ul#projects');
		list.empty();

		// TODO: If from c# must double parse;
		var dashboard =  JSON.parse(JSON.parse(data));
		for (var i = 0; i < dashboard.Projects.length; i++) {
			var project = dashboard.Projects[i];
			//var environment = dashboard.Environments[0];

			var success;
			for (var y = 0; y < dashboard.Items.length; y++) {
				if (dashboard.Items[y].ProjectId === project.Id) {
					success = !dashboard.Items[y].HasPendingInterruptions && !dashboard.Items[y].HasWarningsOrErrors;
				}
			}

			var listItem = $('<li>' + project.Name + '</li>');
			//listItem.attr('class', success ? "success" : "error");
			listItem.attr('data-project-id', project.Id);

			list.append(listItem);
		}

		list.find('li:first-child').addClass('active');

	});



	Main.socket.on('deploy_started', function(taskId) {

		deployInProgress = setInterval(function () {
			Main.socket.emit('get_deploy_status', taskId);
		}, 8000);


	});

	Main.socket.on('set_deploy_status', function(data) {
		var status =  JSON.parse(JSON.parse(data));
		var projects = $('ul#projects');

		if (status.IsCompleted) {
			clearInterval(deployInProgress);
			project = projects.find('li.active');
			project.removeClass('in-progress');

			if (status.FinishedSuccessfully) {
				project.addClass('success');
			}
			else if (status.HasWarningsOrErrors) {
				project.addClass('error');
			}
		}

	});

	Main.socket.on('inputs_up', function() {
		up();
	});

	Main.socket.on('inputs_down', function() {
		down();
	});

	Main.socket.on('inputs_left', function() {
		left();
	});

	Main.socket.on('inputs_right', function() {
		right();
	});

	Main.socket.on('inputs_button', function() {
		triggerDeploy();
	});

	function up() {
		console.log('joystick_up');

		var activeItem = $('ul#projects li.active');
		var activeIndex = $('ul#projects li').index(activeItem);

		activeItem.removeClass('active');

		if (activeIndex === 0) {
			$('ul#projects li:last-child').addClass('active');
		} else {
			activeItem.prev('li').addClass('active');
		}
	}

	function down() {
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
	}

	function left() {
		// clearInterval(buildStatusInterval);

		Main.ngScope().$apply(function() {
			Main.ngScope().routeLeft();
		});
	}

	function right() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeRight();
		});
	}

	function triggerDeploy() {
		var projects = $('ul#projects');

		console.log('button pushed');
		var projectId = $('ul#projects li.active').data('project-id');

		console.log('project id: ' + projectId);

		Main.socket.emit('trigger_deploy', projectId);

		projects.find('[data-project-id="' + projectId + '"]').addClass('in-progress');
	}



})();
