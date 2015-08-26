function Environments() {

  var self = this;

  this.projectId;
  this.releaseId;
  this.releaseVersion;
  this.deployInProgress = false;
  this.buttonIsArmed = false;

  this.init = function() {
    this.startSpinner();
    this.pageLock = true;
    this.buttonIsArmed = true;

    this.navigationList = $('ul#environments');

    // TODO: Remove after test
    $(document).unbind("hitenter", hitEnter);
    $(document).keydown("hitenter", hitEnter);

    function hitEnter(e) {
      switch (e.which) {

        case 13: // enter
          triggerDeploy();
          console.log('e');
          break;

        default:
          return;
      }
      e.preventDefault();
    }

    setTimeout(function() {
      self.projectId = self.ngScope().projectId;
      self.releaseId = self.ngScope().releaseId;
      self.socket.emit('get_environments', { projectId: self.projectId, releaseId: self.releaseId }, function(environments) {
        setEnvironments(environments);
      });
    }, 500);

    this.socket.removeListener('inputs_button');
    this.socket.on('inputs_button', function() {
      triggerDeploy();
    });

    this.socket.removeListener('deploy_started');
    this.socket.on('deploy_started', function(taskId) {
      self.deployInProgress = setInterval(function () {
        self.socket.emit('get_deploy_status', taskId);
      }, 8000);
    });

    this.socket.removeListener('set_deploy_status');
    this.socket.on('set_deploy_status', function(data) {
      setDeployStatus(data);
    });
  };

  this.left = function() {
    this.buttonIsArmed = false;
    if (!this.pageLock && !this.lockRight) {
      this.socket.emit('disarm_deploy_button');
      this.ngScope().$apply(function() {
  			self.ngScope().routeLeft();
  		});
    }
	};

	this.right = function() {
    // TODO: what to do here?
    this.buttonIsArmed = false;
    this.socket.emit('disarm_deploy_button');
    if (!this.pageLock && !this.lockRight) {
      this.ngScope().$apply(function() {
  			self.ngScope().routeRight();
  		});
    }
	};

  function setEnvironments(data) {
    var environmentPage =  JSON.parse(JSON.parse(data));

    if (environmentPage.Environments.length === 0) {
			var listItem = $('<li><div>' +
												'<h2>No environments for the selected project were found.</h3>' +
											'</div></li>');
			self.navigationList.append(listItem);
      self.navigationList.appendTo('.wrapper nav');
      self.lockRight = true;
		} else {
      releaseVersion = environmentPage.ReleaseVersion;

      $('.head-line h1').text(environmentPage.ProjectName);
      $('.head-description h3').text("Version " + releaseVersion);

      for (var i = 0; i < environmentPage.Environments.length; i++) {
        var env = environmentPage.Environments[i];

        var listItem = $('<li><div>' +
                           '<h2>' + env.Name + '</h2>' +
                           '<h3>' + env.ReleaseVersion + '</h3>' +
                          '<h4>' + env.LastDeploy + '</h4>' +
                        '</div></li>');

        listItem.attr('data-environment-id', env.Id);

        if (env.Status == 0) {
          listItem.addClass('success');
        } else  if (env.Status == 1) {
          listItem.addClass('fail');
        } else  if (env.Status == 2) {
          listItem.addClass('in-progress');
        }

        self.navigationList.append(listItem);
      }

      self.navigationList.find('li:first-child').addClass('current');
      self.navigationList.appendTo('.wrapper nav');

      self.lockRight = false;
      self.socket.emit('arm_deploy_button');
    }

    $('.btn-container').removeClass('hidden');
    $('header').removeClass('hidden');
    self.navigationList.removeClass('hidden');

    self.pageLock = false;
    self.stopSpinner();
  }

  function triggerDeploy() {
    if (self.buttonIsArmed) {
      self.pageLock = true;

      var activeItem = self.navigationList.find('li.current');
      if (activeItem.length > 0) {
        var environmentId = activeItem.data('environment-id');

    		self.socket.emit('trigger_deploy', { projectId: self.projectId, releaseId: self.releaseId, environmentId: environmentId });
    		activeItem.addClass('in-progress');
      }
    }
	}

  function setDeployStatus(data) {
    var status =  JSON.parse(JSON.parse(data));

		if (status.IsCompleted) {
			clearInterval(self.deployInProgress);
			env = self.navigationList.find('li.current');
			env.removeClass('in-progress');
      env.find('h3').text(self.releaseVersion);
      env.find('h4').text(status.CompletedTime);

			if (status.FinishedSuccessfully) {
				env.addClass('success');
        self.socket.emit('deploy_succeeded');
			}
			else if (status.HasWarningOrErrors) {
				env.addClass('error');
        self.socket.emit('deploy_failed');
			}

      self.pageLock = false;
		}
  }

  this.init();
}

Environments.prototype = Main;
var Environments = new Environments();
