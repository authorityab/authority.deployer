function projects() {
	Main.stopSpinner();
  Main.startSpinner();

	var projectList

	$(function() {
		projectList = $('ul#projects');

		Main.socket.emit('get_projects');
		Main.socket.on('set_projects', function(data) {
			setProjects(data);
			Main.socket.removeListener('set_projects');
		});

		Main.pageLock = true;
	});

	function right() {
		if (!Main.pageLock && !Main.lockRight) {
			var projectId = projectList.find('li.current').data('project-id');
			Main.ngScope().$apply(function() {
				Main.ngScope().routeRight(projectId);
			});
		}
	}

	function setProjects(data) {
		var projects =  JSON.parse(JSON.parse(data));

		if (projects.length === 0) {
			var listItem = $('<li><div>' +
												'<h2>No projects were found.</h3>' +
											'</div></li>');
			projectList.append(listItem);
			Main.lockRight = true;
		} else {
			for (var i = 0; i < projects.length; i++) {
				var project = projects[i];

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

		Main.pageLock = false;
		Main.stopSpinner();
	}

	return {
		list: projectList,
		right: right,
		setProjects: setProjects
	}

}
