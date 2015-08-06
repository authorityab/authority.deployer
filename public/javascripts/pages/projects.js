function projects() {

	var deployInProgress;
	var projectList;

	$(function() {

		projectList = $('.project-list');

		//TODO: Remove after test
		// $(document).unbind();
		// $(document).keydown(function(e) {
	  //   switch(e.which) {
		//
	  //       case 37: // left
		// 			left();
		// 			console.log('l');
	  //       break;
		//
		// 			case 38: // up
		// 			up();
		// 			console.log('u');
	  //       break;
		//
	  //       case 39: // right
		// 			right();
		// 			console.log('r');
	  //       break;
		//
		// 			case 40: // down
		// 			down();
		// 			console.log('d');
	  //       break;
		//
	  //       default: return;
	  //   }
    // 	e.preventDefault();
		// });



	});

	Main.socket.emit('get_projects');
  Main.socket.on('set_projects', function(data) {
    setProjects(data);
	});








	function up() {
		var activeItem = projectList.find('li.current');
		var activeIndex = projectList.find('li').index(activeItem);

		activeItem.removeClass('current');

		if (activeIndex === 0) {
			projectList.find('li:last-child').addClass('current');
		} else {
			activeItem.prev('li').addClass('current');
		}
	}

	function down() {
		var totalCount = projectList.find('li').length;
		var activeItem = projectList.find('li.current');
		var activeIndex = projectList.find('li').index(activeItem);

		activeItem.removeClass('current');

		if (activeIndex === totalCount - 1) {
			projectList.find('li:first-child').addClass('current');
		} else {
			activeItem.next('li').addClass('current');
		}
	}

	function left() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeLeft();
		});
	}

	function right() {
		var projectId = projectList.find('li.current').data('project-id');

		Main.ngScope().$apply(function() {
			Main.ngScope().routeRight(projectId);
		});
	}


	function setProjects(data) {
		var projects =  JSON.parse(JSON.parse(data));
    Main.projectParams.projects = projects;

		for (var i = 0; i < Main.projectParams.projects.length; i++) {
			var project = Main.projectParams.projects[i];

			var listItem = $('<li><div>' +
											 	'<h2>' + project.Name + '</h2>' +
										 		'<h3>' + project.Id + '</h3>' +
												'<h4>' + project.Description + '</h4>' +
										  '</div></li>');

			listItem.attr('data-project-id', project.Id);
			projectList.append(listItem);
		}

		projectList.find('li:first-child').addClass('current');
	}

	return {
		up: up,
		down: down,
		left: left,
		right: right,
		setProjects: setProjects
	}

} //)();

// Main.currentPage = Projects;
// var Projects = new projects();
