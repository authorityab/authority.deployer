function BuildStatus() {

  var self = this;

  this.init = function() {
    this.startSpinner();
    this.navigationList = $('nav .project-list');
  };

  this.left = function() {
    if (!this.pageLock) {
      this.ngScope().$apply(function() {
        self.ngScope().routeLeft();
      });
    }
  };

  this.right = function() {
    if (!this.pageLock) {
      this.ngScope().$apply(function() {
        self.ngScope().routeRight();
      });
    }
  };

  this.setFailedBuilds = function() {
    var currentIndex = this.navigationList.find('li.current').index();
    this.navigationList.empty();

    for (var i = 0; i < this.buildParams.failedBuilds.length; i++) {
      var build = this.buildParams.failedBuilds[i];

      var listItem = $('<li><div>' +
											 	'<h2>' + build.ProjectName + '</h2>' +
										 		'<h3>' + build.StepName + '</h3>' +
												'<h4>' + build.LastBuild + '</h4>' +
										  '</div></li>');

      listItem.attr('class', 'error');
      this.navigationList.append(listItem);
    }

    if (currentIndex > -1) {
      $(this.navigationList.find('li')[currentIndex]).addClass('current');
    } else {
      this.navigationList.find('li:first-child').addClass('current');
    }

    this.stopSpinner();
  };

  this.init();
}

BuildStatus.prototype = Main;
var BuildStatus = new BuildStatus();
