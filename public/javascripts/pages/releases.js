function releases() {

  var projectId;
  var releaseList;


  $(function() {


    //TODO: Remove after test
    // $(document).unbind();
    // $(document).keydown(function(e) {
    //   switch (e.which) {
    //     case 37: // left
    //       left();
    //       console.log('l');
    //       break;
    //
    //     case 39: // right
    //       right();
    //       console.log('r');
    //       break;
    //
    //     default:
    //       return;
    //   }
    //   e.preventDefault();
    // });

  });



  //FIXME: Wait for the scope to be loaded. This is probably not the best solution...
  //       But the scope needs to load;
  setTimeout(function() {
    projectId = Main.ngScope().projectId;

    console.log(projectId);

    Main.socket.emit('get_releases', projectId);
    // Main.socket.emit('get_project_info', projectId);

  }, 500);

  // Main.socket.on('set_project_info', function(data) {
  //   setProjectInfo(data);
  //   Main.socket.removeListener('set_project_info');
  // });

  Main.socket.on('set_releases', function(data) {
    setReleases(data);
    Main.socket.removeListener('set_releases');
  });

  // Main.socket.on('set_latest_deploys', function(data) {
  //   setLatestDeploys(data);
  //   Main.socket.removeListener('set_latest_deploys');
  // });

  function setReleases(data) {
    releaseList = $('<ul class="project-list"></ul>');
    var releasePage = JSON.parse(JSON.parse(data));

    $('.head-line h1').text(releasePage.ProjectName);
    $('.head-description h3').text(releasePage.ProjectDescription);


    // Main.releaseParams.releases = releases;

		for (var i = 0; i < releasePage.Releases.length; i++) {
			var release = releasePage.Releases[i];

      var notes = '';
      if (release.ReleaseNotes != null) {
        notes = release.ReleaseNotes;
      }

      var listItem = $('<li><div>' +
											 	'<h2>Version ' + release.Version + '</h2>' +
										 		'<h3>' + notes + '</h3>' +
												'<h4>' + release.Assembled + '</h4>' +
										  '</div></li>');

			listItem.attr('data-release-id', release.Id);

      if (release.DeployedTo.length > 0 ) {
        var environments = '';
        for (var y = 0; y < release.DeployedTo.length; y++) {
          environments += " " + release.DeployedTo[y];
        }

        var envString = environments.substring(1);

        listItem.append('<span class="message-badge">' + envString + '</span>');
      }

			releaseList.append(listItem);
		}

    releaseList.find('li:first-child').addClass('current');

    releaseList.appendTo('.wrapper nav');
    // Main.socket.emit('get_latest_deploys', projectId);
  }

  // function setProjectInfo(project) {
  //   var project =  JSON.parse(JSON.parse(data));
  //   Main.projectParams.currentProject = project;
  //
  //   $('.head-line h1').text(project.Name);
  //   $('.head-description h3').text(project.Description);
  // }

  // function setLatestDeploys(data) {
  //   var deploys =  JSON.parse(JSON.parse(data));
  //   Main.deployParams.latestDeploys = deploys;
  //
  //   releaseList.find('li').each(function () {
  //     var item = $(this);
  //     for (var i = 0; i < Main.deployParams.latestDeploys.length; i++) {
  //       var deploy = Main.deployParams.latestDeploys[i];
  //       if (deploy.ReleaseId == item.data('release-id')) {
  //         for (var y = 0; y < Main.environmentParams.environments.length; y++) {
  //           var env = Main.environmentParams.environments[y];
  //           if (deploy.EnvironmentId == env.Id) {
  //             item.append('<span class="message-badge">' + env.Name + '</span>')
  //           }
  //         }
  //       }
  //     }
  //     releaseList.appendTo('.wrapper nav');
  //   });
  // }

  function up() {
    console.log('up rel');
		var activeItem = releaseList.find('li.current');
		var activeIndex = releaseList.find('li').index(activeItem);

		activeItem.removeClass('current');

		if (activeIndex === 0) {
			releaseList.find('li:last-child').addClass('current');
		} else {
			activeItem.prev('li').addClass('current');
		}
	}

	function down() {
    console.log('down rel');
		var totalCount = releaseList.find('li').length;
		var activeItem = releaseList.find('li.current');
		var activeIndex = releaseList.find('li').index(activeItem);

		activeItem.removeClass('current');

		if (activeIndex === totalCount - 1) {
			releaseList.find('li:first-child').addClass('current');
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
		var releaseId = releaseList.find('li.current').data('release-id');

    for (var i = 0; i < Main.releaseParams.releases.length; i++) {
      var release = Main.releaseParams.releases[i];
      if (release.Id == releaseId) {
        Main.releaseParams.currentRelease = release;
        break;
      }
    }

    console.log("pid: " +  projectId);
    console.log("rid: " +  releaseId);

		Main.ngScope().$apply(function() {
			Main.ngScope().routeRight(projectId, releaseId);
		});
	}

  return {
    up: up,
		down: down,
		left: left,
		right: right
  }


} //)();

// var Releases = new releases();
// Main.currentPage = Releases;
