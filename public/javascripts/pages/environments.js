function environments() {
  Main.startSpinner();

  var environmentList;
  var projectId;
  var releaseId;
  var releaseVersion;
  var deployInProgress;

  $(function() {
    Main.pageLock = true;

    environmentList = $('ul#environments');

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
      projectId = Main.ngScope().projectId;
      releaseId = Main.ngScope().releaseId;
      Main.socket.emit('get_environments', projectId, releaseId);
    }, 500);

    Main.socket.removeListener('inputs_button');
  	Main.socket.on('inputs_button', function() {
      console.log('button eee');
  		triggerDeploy();
  	});

    Main.socket.removeListener('deploy_started');
  	Main.socket.on('deploy_started', function(taskId) {
  		deployInProgress = setInterval(function () {
  			Main.socket.emit('get_deploy_status', taskId);
  		}, 8000);
  	});

    Main.socket.removeListener('set_deploy_status');
  	Main.socket.on('set_deploy_status', function(data) {
      setDeployStatus(data);
  	});

    Main.socket.removeListener('set_environments');
    Main.socket.on('set_environments', function(data) {
      setEnvironments(data);
    });

  });

  function left() {
    if (!Main.pageLock && !Main.lockRight) {
      Main.socket.emit('disarm_deploy_button');
      Main.ngScope().$apply(function() {
  			Main.ngScope().routeLeft();
  		});
    }
	}

	function right() {
    // TODO: what to do here?
    Main.socket.emit('disarm_deploy_button');
    if (!Main.pageLock && !Main.lockRight) {
      Main.ngScope().$apply(function() {
  			Main.ngScope().routeRight();
  		});
    }
	}

  function setEnvironments(data) {
    var environmentPage =  JSON.parse(JSON.parse(data));

    if (environmentPage.Environments.length === 0) {
			var listItem = $('<li><div>' +
												'<h2>No environments for the selected project were found.</h3>' +
											'</div></li>');
			environmentList.append(listItem);
      environmentList.appendTo('.wrapper nav');
      Main.lockRight = true;
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

        environmentList.append(listItem);
      }

      environmentList.find('li:first-child').addClass('current');
      environmentList.appendTo('.wrapper nav');

      Main.lockRight = false;
      Main.socket.emit('arm_deploy_button');
    }

    $('.btn-container').removeClass('hidden');
    $('header').removeClass('hidden');
    environmentList.removeClass('hidden');

    Main.pageLock = false;
    Main.stopSpinner();
  }

  function triggerDeploy() {
    Main.pageLock = true;

    var activeItem = environmentList.find('li.current');
    if (activeItem.length > 0) {
      var environmentId = activeItem.data('environment-id');

  		Main.socket.emit('trigger_deploy', projectId, releaseId, environmentId);
  		activeItem.addClass('in-progress');
    }
	}

  function setDeployStatus(data) {
    var status =  JSON.parse(JSON.parse(data));

		if (status.IsCompleted) {
			clearInterval(deployInProgress);
			env = environmentList.find('li.current');
			env.removeClass('in-progress');
      env.find('h3').text(releaseVersion);
      env.find('h4').text(status.CompletedTime);

			if (status.FinishedSuccessfully) {
				env.addClass('success');
        Main.socket.emit('deploy_succeeded');
			}
			else if (status.HasWarningsOrErrors) {
				env.addClass('error');
        Main.socket.emit('deploy_failed');
			}

      Main.pageLock = false;
		}
  }

  return {
    list: environmentList,
    left: left,
		right: right,
    setEnvironments: setEnvironments
  }
}
