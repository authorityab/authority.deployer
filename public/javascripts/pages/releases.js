var Releases = (function() {

  var projectId;
  var releaseList


  $(function() {


    //TODO: Remove after test
    $(document).unbind();
    $(document).keydown(function(e) {
      switch (e.which) {
        case 37: // left
          left();
          console.log('l');
          break;

        case 39: // right
          right();
          console.log('r');
          break;

        default:
          return;
      }
      e.preventDefault();
    });

  });



  //FIXME: Wait for the scope to be loaded. This is probably not the best solution...
  //       But the scope needs to load;
  var releaseTimeout = setTimeout(function() {
    projectId = Main.ngScope().projectId;

    console.log(projectId);

    Main.socket.emit('get_releases', projectId);

  }, 500);


  Main.socket.on('set_releases', function(data) {
    var releases = JSON.parse(JSON.parse(data));

    releaseList = $('<ul id="releases"></ul>');

		for (var i = 0; i < releases.length; i++) {
			var release = releases[i];
			var listItem = $('<li>' + release.Version + '</li>');
			listItem.attr('data-release-id', release.Id);

			releaseList.append(listItem);
		}

    Main.socket.emit('get_latest_deploys', projectId);

    console.log('set releases');

    Main.socket.removeListener('set_releases');

    // clearTimeout(releaseTimeout);
  });

  Main.socket.on('set_latest_deploys', function(data) {

    var deploys =  JSON.parse(JSON.parse(data));
    Main.deployParams.latestDeploys = deploys;

    releaseList.find('li').each(function () {
      var item = $(this);
      for (var i = 0; i < Main.deployParams.latestDeploys.length; i++) {
        var deploy = Main.deployParams.latestDeploys[i];

        if (deploy.ReleaseId == item.data('release-id')) {
          var envName;

          for (var y = 0; y < Main.environmentParams.environments.length; y++) {
            var env = Main.environmentParams.environments[y];
            if (deploy.EnvironmentId == env.Id) {
              console.log('ENV 2');
              envName = env.Name;
              item.append('<span>' + envName + '</span>')
            }
          }
        }

      }

      releaseList.appendTo('#wrapper');
    });

    Main.socket.removeListener('set_latest_deploys');


  });

  function left() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeLeft();
		});
	}

	function right() {
		var releaseId = releaseList.find('li.active').data('release-id');
    //var projectId = $('#projectId').val();

		Main.ngScope().$apply(function() {
			Main.ngScope().routeRight(projectId, releaseId);
		});
	}


})();
