function releases() {
  Main.stopSpinner();
  Main.startSpinner();

  var projectId;
  var releaseList;

  $(function() {
    releaseList = $('ul#releases');

    //FIXME: Wait for the scope to be loaded. This is probably not the best solution...
    //       But the scope needs to load;
    setTimeout(function() {
      projectId = Main.ngScope().projectId;
      Main.socket.emit('get_releases', projectId);
      Main.pageLock = true;
    }, 500);

    Main.socket.on('set_releases', function(data) {
      setReleases(data);
      Main.socket.removeListener('set_releases');
    });
  });

  function right() {
    if (!Main.pageLock && !Main.lockRight) {
      var releaseId = releaseList.find('li.current').data('release-id');

      Main.ngScope().$apply(function() {
        Main.ngScope().routeRight(projectId, releaseId);
      });
    }
  }

  function setReleases(data) {
    var releasePage = JSON.parse(JSON.parse(data));

    $('.head-line h1').text(releasePage.ProjectName);
    $('.head-description h3').text(releasePage.ProjectDescription);

    if (releasePage.Releases.length === 0) {
      var listItem = $('<li><div>' +
                         '<h2>No releases for the selected project have been published yet.</h3>' +
                      '</div></li>');
      releaseList.append(listItem);
      releaseList.appendTo('.wrapper nav');
      Main.lockRight = true;
    } else {
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
    }

    Main.pageLock = false;
    Main.stopSpinner();
    releaseList.removeClass('hidden');
    $('header').removeClass('hidden');
  }

  return {
    list: releaseList,
		right: right
  }
}
