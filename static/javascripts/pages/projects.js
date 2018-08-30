function Projects() {
  var self = this;

  this.init = function() {
    self.socket.emit('loading_start');

    this.pageLock = true;
		this.navigationList = $('#projects ul');

		this.socket.emit('get_projects', function(projects) {
      self.setProjects(projects);
    });
  };

	this.setProjects = function(data) {
		var projects =  JSON.parse(data);

		if (projects === null || projects.length === 0) {
			var listItem = $('<li><div>' +
												'<h2>No projects were found.</h3>' +
											'</div></li>');
			this.navigationList.append(listItem);
			this.lockRight = true;
		} else {
			for (var i = 0; i < projects.length; i++) {
				var project = projects[i];

				var listItem = $('<li><div>' +
												 	'<h2>' + project.Name + '</h2>' +
											 		'<h3>' + project.GroupName + '</h3>' +
													'<h4>' + project.Description + '</h4>' +
											  '</div></li>');

				listItem.attr('data-project-id', project.Id);
				this.navigationList.append(listItem);
			}

			this.navigationList.find('li:first-child').addClass('current');
			this.lockRight = false;
		}

		this.pageLock = false;
    self.socket.emit('loading_stop');
	};

  this.right = function() {
    var page = this;
    if (!page.pageLock && !page.lockRight) {
      var projectId = page.navigationList.find('li.current').data('project-id');
      page.ngScope().$apply(function() {
        page.ngScope().routeRight(projectId);
      });
    }
  };

  this.init();
}
