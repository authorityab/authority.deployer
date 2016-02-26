function Releases() {
  var self = this;

  this.projectId;

  this.init = function() {
    // this.startSpinner();
    this.pageLock = true;
    this.navigationList = $('ul#releases');

    setTimeout(function() {
      projectId = self.ngScope().projectId;
      self.socket.emit('get_releases', projectId, function(releases) {
        setReleases(releases);
      });
    }, 500);
  };

  this.right = function() {
    var page = this;
    if (!page.pageLock && !page.lockRight) {
      var releaseId = page.navigationList.find('li.current').data('release-id');

      page.ngScope().$apply(function() {
        page.ngScope().routeRight(projectId, releaseId);
      });
    }
  };

  function setReleases(data) {
    var releases = JSON.parse(data);

    $('.head-line h1').text(releases.ProjectName);
    $('.head-description h3').text(releases.ProjectDescription);

    if (releases === null || releases.Items.length === 0) {
      var listItem = $('<li><div>' +
                         '<h2>No releases for the selected project have been published yet.</h3>' +
                      '</div></li>');
      self.navigationList.append(listItem);
      self.navigationList.appendTo('.wrapper nav');
      self.lockRight = true;
    } else {
      for (var i = 0; i < releases.Items.length; i++) {
  			var release = releases.Items[i];

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
  			self.navigationList.append(listItem);
  		}

      self.navigationList.find('li:first-child').addClass('current');
      self.navigationList.appendTo('.wrapper nav');

      self.lockRight = false;
    }

    self.navigationList.removeClass('hidden');
    $('header').removeClass('hidden');

    self.pageLock = false;
    // self.stopSpinner();
  }

  this.init();
}
