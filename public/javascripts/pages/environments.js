function environments() {

  var environmentList;
  var projectId;
  var releaseId;
  var releaseVersion;

  $(function() {

    $(document).keydown(function(e) {
      switch (e.which) {

        case 13: // enter
          triggerDeploy();
          console.log('e');
          break;

        default:
          return;
      }
      e.preventDefault();
    });

    // setEnvironments();
  });

  setTimeout(function() {
    console.log('WHAT');
    projectId = Main.ngScope().projectId;
    releaseId = Main.ngScope().releaseId;

    console.log(projectId, releaseId);

    Main.socket.emit('get_environments', projectId, releaseId);
    // Main.socket.emit('get_project_info', projectId);

  }, 500);

  Main.socket.removeListener('inputs_button');
	Main.socket.on('inputs_button', function() {
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

  // Main.socket.removeListener('set_latest_deploy_tasks');
	// Main.socket.on('set_latest_deploy_tasks', function(data) {
  //   setDeployTasks(data);
	// });

  function up() {
    console.log('up env');
		var activeItem = environmentList.find('li.current');
		var activeIndex = environmentList.find('li').index(activeItem);

		activeItem.removeClass('current');

		if (activeIndex === 0) {
			environmentList.find('li:last-child').addClass('current');
		} else {
			activeItem.prev('li').addClass('current');
		}
	}

	function down() {
    console.log('down env');
		var totalCount = environmentList.find('li').length;
		var activeItem = environmentList.find('li.current');
		var activeIndex = environmentList.find('li').index(activeItem);

    console.log('totalCount ' + totalCount);
    console.log('activeItem ' + activeItem);
    console.log('activeIndex ' + activeIndex);

    console.log(activeItem.find('h2').text());

		activeItem.removeClass('current');

		if (activeIndex === totalCount - 1) {
			environmentList.find('li:first-child').addClass('current');
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
    // TODO: what to do here?
    Main.ngScope().$apply(function() {
			Main.ngScope().routeRight();
		});
	}

  function triggerDeploy() {
    // var projectId = $('#projectId').val();
    // var releaseId = $('#releaseId').val();

		// var environments = $('ul#environments');

		console.log('button pushed');
    var activeItem = environmentList.find('li.current');
		var environmentId = activeItem.data('environment-id');
    // releaseVersion = activeItem.data('release-version')

		console.log('project id: ' + projectId);
    console.log('release id: ' + releaseId);
    console.log('environment id: ' + environmentId);

		Main.socket.emit('trigger_deploy', projectId, releaseId, environmentId);

		activeItem.addClass('in-progress');
	}

  function setDeployStatus(data) {
    var status =  JSON.parse(JSON.parse(data));
		// var projects = $('ul#projects');

		if (status.IsCompleted) {
			clearInterval(deployInProgress);
			env = environmentList.find('li.current');
			env.removeClass('in-progress');
      env.find('h3').text(releaseVersion);
      env.find('h4').text(status.CompletedTime);

			if (status.FinishedSuccessfully) {
				env.addClass('success');
			}
			else if (status.HasWarningsOrErrors) {
				env.addClass('error');
			}
		}

  }

  function setEnvironments(data) {

    // var projectId = Main.ngScope().projectId;
    // var releaseId = Main.ngScope().releaseId;
    environmentList = $('<ul class="project-list"></ul>');

    console.log('set env: ' + environmentList.length);

    var environmentPage =  JSON.parse(JSON.parse(data));

    releaseVersion = environmentPage.ReleaseVersion;

    $('.head-line h1').text(environmentPage.ProjectName);
    $('.head-description h3').text("Version " + releaseVersion);

    var taskIds = "";

    for (var i = 0; i < environmentPage.Environments.length; i++) {
      var env = environmentPage.Environments[i];

      var listItem = $('<li><div>' +
                         '<h2>' + env.Name + '</h2>' +
                         '<h3>' + env.ReleaseVersion + '</h3>' +
                        '<h4>' + env.LastDeploy + '</h4>' +
                      '</div></li>');

      listItem.attr('data-environment-id', env.Id);
      // listItem.attr('data-release-version', environmentPage.ReleaseVersion);
      // listItem.attr('data-task-id', taskId);

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
  }
      // var releaseVersion = '';
      // var lastDeploy = '';
      // var taskId;
      // for (var y = 0; y < Main.deployParams.latestDeploys.length; y++) {
      //   var deploy = Main.deployParams.latestDeploys[y];
      //
      //
      //   if (deploy.EnvironmentId == env.Id)  {
      //     taskId + deploy.TaskId;
      //
      //     lastDeploy = "Last Deploy: " + deploy.Created + ", " + deploy.LastModifiedBy;
      //
      //
      //     for (var z = 0; z < Main.releaseParams.releases.length; z++) {
      //       var release = Main.releaseParams.releases[z];
      //
      //       if (release.Id == deploy.ReleaseId) {
      //         releaseVersion = release.Version;
      //       }
      //     }
      //   }
      // }



      // Main.socket.emit('get_latest_deploy_tasks', projectId);



    // function setDeployTasks(data) {
    //   console.log('setDeployTasks data: ' + data);
    //   var tasks =  JSON.parse(JSON.parse(data));
    //   Main.deployParams.latestDeployTasks = tasks;
    //
    //
    //   for (var i = 0; i < Main.deployParams.latestDeployTasks; i++) {
    //     var task = Main.deployParams.latestDeployTasks[i];
    //
    //     var item = environmentList.find('li[data-task-id="' + task.Id + '"]');
    //
    //     if (task.IsCompleted && task.FinishedSuccessfully && !task.HasWarningsOrErrors) {
    //       item.addClass('success');
    //     } else {
    //       item.addClass('fail');
    //     }
    //   }
    //
    //
    //
    // }


      // for (var z = 0; z < Main.releaseParams.releases.length; z++) {
      //   var release = Main.releaseParams.releases[z];
      //   if (release.)
      // }

      // for (var z = 0; z < Main.releaseParams.releases.length; z++) {
      //   var release = Main.releaseParams.releases[z];
      //
      //   for (var y = 0; y < Main.deployParams.latestDeploys.length; y++) {
      //     var deploy = Main.deployParams.latestDeploys[y];
      //
      //
      //     if (deploy.EnvironmentId === env.Id)
      //     taskIds += "," + deploy.TaskId;
      //   }





  return {
    up: up,
		down: down,
		left: left,
		right: right,
    setEnvironments: setEnvironments
  }


} //)();

// var Environments = new environments();
// Main.currentPage = Environments;
