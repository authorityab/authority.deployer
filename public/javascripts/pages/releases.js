function Releases() {

  var self = this;
  this.projectId;

  this.init = function() {
    this.startSpinner();
    this.pageLock = true;
    this.navigationList = $('ul#releases');

    setTimeout(function() {
      projectId = self.ngScope().projectId;
      self.socket.emit('get_releases', projectId, function(releases) {
        setReleases(releases);
      });
    }, 500);
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
      var releaseId = this.navigationList.find('li.current').data('release-id');

      this.ngScope().$apply(function() {
        self.ngScope().routeRight(projectId, releaseId);
      });
    }
  };

  function setReleases(data) {
    var releasePage = JSON.parse(JSON.parse(data));

    $('.head-line h1').text(releasePage.ProjectName);
    $('.head-description h3').text(releasePage.ProjectDescription);

    if (releasePage.Releases.length === 0) {
      var listItem = $('<li><div>' +
                         '<h2>No releases for the selected project have been published yet.</h3>' +
                      '</div></li>');
      self.navigationList.append(listItem);
      self.navigationList.appendTo('.wrapper nav');
      self.lockRight = true;
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
  			self.navigationList.append(listItem);
  		}

      self.navigationList.find('li:first-child').addClass('current');
      self.navigationList.appendTo('.wrapper nav');

      self.lockRight = false;
    }

    self.navigationList.removeClass('hidden');
    $('header').removeClass('hidden');

    self.pageLock = false;
    self.stopSpinner();
  }

  this.init();
}

Releases.prototype = Main;
var Releases = new Releases();
