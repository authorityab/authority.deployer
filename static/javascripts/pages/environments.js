function Environments() {
  var self = this;

  this.projectId;
  this.releaseId;
  this.releaseVersion;
  this.deployInProgress = false;
  this.buttonIsArmed = false;

  this.init = function() {
    // this.startSpinner();
    this.pageLock = true;
    this.buttonIsArmed = true;
    this.navigationList = $('#environments ul');

    // TODO: Remove after test
    $(document).off('keydown', hitEnter);
    $(document).on('keydown', hitEnter);

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
      // TODO: What to do if taskId is null?
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
    var page = this;
    page.buttonIsArmed = false;
    if (!page.pageLock && !page.lockLeft) {
      page.socket.emit('disarm_deploy_button');
      page.ngScope().$apply(function() {
        page.ngScope().routeLeft();
      });
    }
  };

  this.right = function() {
    // TODO: what to do here?
    var page = this;
    if (!page.pageLock && !page.lockRight) {
      page.buttonIsArmed = false;
      page.socket.emit('disarm_deploy_button');
      page.ngScope().$apply(function() {
        page.ngScope().routeRight();
      });
    }
  };

  function setEnvironments(data) {
    var environments =  JSON.parse(data);

    if (environments == null || environments.Items.length === 0) {
			var listItem = $('<li><div>' +
												'<h2>No environments for the selected project were found.</h3>' +
											'</div></li>');
			self.navigationList.append(listItem);
      self.navigationList.appendTo('.wrapper nav');
      self.lockRight = true;
		} else {
      self.releaseVersion = environments.ReleaseVersion;

      $('.head-line h1').text(environments.ProjectName);
      $('.head-description h3').text("Version " + self.releaseVersion);

      for (var i = 0; i < environments.Items.length; i++) {
        var env = environments.Items[i];

        var listItem = $('<li><div>' +
                           '<h2>' + env.Name + '</h2>' +
                           '<h3>' + env.ReleaseVersion + '</h3>' +
                          '<h4>' + env.LastDeploy + '</h4>' +
                        '</div></li>');

        listItem.attr('data-environment-id', env.Id);

        listItem.removeClass('success fail');
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
    // self.stopSpinner();
  }

  function triggerDeploy() {
    if (self.buttonIsArmed) {
      self.pageLock = true;

      var activeItem = self.navigationList.find('li.current');
      if (activeItem.length > 0) {
        var environmentId = activeItem.data('environment-id');

    		self.socket.emit('trigger_deploy', { projectId: self.projectId, releaseId: self.releaseId, environmentId: environmentId });
        activeItem.removeClass('success fail');
    		activeItem.addClass('in-progress');
      }
    }
    self.socket.removeListener('inputs_button');
	}

  function setDeployStatus(data) {
    var status =  JSON.parse(data);
    var env = self.navigationList.find('li.current');
    env.removeClass('success fail');

    if (status === null) {
      env.removeClass('in-progress');
      env.addClass('fail');
      self.socket.emit('deploy_failed');
      self.pageLock = false;
    } else {
      if (status.IsCompleted) {
        clearInterval(self.deployInProgress);

        env.removeClass('in-progress');
        env.find('h3').text(self.releaseVersion);
        env.find('h4').text(status.CompletedTime);

        if (status.FinishedSuccessfully) {
          env.addClass('success');
          self.socket.emit('deploy_succeeded');
          setTimeout(function() {
            self.right();
          }, 10000);
        }
        else if (status.HasWarningOrErrors) {
          env.addClass('fail');
          self.socket.emit('deploy_failed');
        }

        self.pageLock = false;
      }
    }
  }

  this.init();
}
