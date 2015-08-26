function Projects() {

  var self = this;

  this.init = function() {
    this.startSpinner();
    this.pageLock = true;
		this.navigationList = $('ul#projects');

		this.socket.emit('get_projects', function(projects) {
      self.setProjects(projects);
    });
  };

  this.left = function() {
   if (!this.pageLock) {
     this.ngScope().$apply(function() {
       self.ngScope().routeLeft();
     });
   }
 };

	this.right = function() {
		if (!this.pageLock && !this.lockRight) {
			var projectId = this.navigationList.find('li.current').data('project-id');
			this.ngScope().$apply(function() {
				self.ngScope().routeRight(projectId);
			});
		}
	};

	this.setProjects = function(data) {
		var projects =  JSON.parse(JSON.parse(data));

		if (projects.length === 0) {
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
                          '<img src="' + project.Logo + '" alt="Project Logo"/>' +

											  '</div></li>');

				listItem.attr('data-project-id', project.Id);
				this.navigationList.append(listItem);
			}

			this.navigationList.find('li:first-child').addClass('current');
			this.lockRight = false;
		}

		this.pageLock = false;
		this.stopSpinner();
	};

  this.init();
}

Projects.prototype = Main;
var Projects = new Projects();
