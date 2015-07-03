var Projects = (function() {

	var deployInProgress;
	var buildStatusInterval;

	var latestFailedBuild;

	$(function() {

		//TODO: Remove after test
		$(document).unbind();
		$(document).keydown(function(e) {
	    switch(e.which) {
	        case 37: // left
					left();
					console.log('l');
	        break;

	        case 39: // right
					right();
					console.log('r');
	        break;

	        default: return;
	    }
    	e.preventDefault();
		});

		$(document).on('click', '#success', function(){
			Main.socket.emit('deploy_succeeded');
		});
		$(document).on('click', '#error', function(){
			Main.socket.emit('deploy_failed');
		});
		$(document).on('click', '#loading', function(){
			Main.socket.emit('trigger_deploy');
		});
		$(document).on('click', '#stop', function(){
			Main.socket.emit('ledstrip_stop');
		});


		Main.socket.emit('get_projects');

		Main.socket.emit('get_latest_failed_build');

		buildStatusInterval = setInterval(function() {
			Main.socket.emit('get_build_status');
		}, 5000);

	});


	function left() {
		clearInterval(buildStatusInterval);

		Main.ngScope().$apply(function() {
			Main.ngScope().routeLeft();
		});
	}

	function right() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeRight();
		});
	}








Main.socket.on('set_latest_failed_build', function(build) {
	latestFailedBuild = JSON.parse(JSON.parse(build));
	setBuildDestroyer('BUILD DESTROYER: ' + latestFailedBuild.BuildDestroyer);
});

function setBuildDestroyer(value) {
	$('#build-destroyer').html(value);
}





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
		var allSuccess = true;

		var list = $('ul#build-statuses');
		list.empty();

		var builds = JSON.parse(JSON.parse(data));
		for (var i = 0; i < builds.length; i++) {
			var build = builds[i];

			if (build.Status === 'FAILURE') {
				allSuccess = false;
			}

			var listItem = $('<li>' + build.BuildConfig.ProjectName + ' ¶ ' + build.BuildConfig.Name + '</li>');
			listItem.attr('class', build.Status === 'SUCCESS' ? "success" : "error");
			list.append(listItem);
		}

		if (allSuccess) {
			setBuildDestroyer('');
		} else {
			Main.socket.emit('get_latest_failed_build');
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

		//var projectId = $('ul#projects li.active').data('project-id');

		console.log('button pushed');

//		$('ul#projects li').removeClass('selected');
//		$('ul#projects li.active').addClass('selected');

		Main.socket.emit('trigger_deploy', projectId);
	});

})();
