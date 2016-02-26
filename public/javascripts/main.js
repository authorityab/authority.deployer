var Main = function() {
  var self = this;

  this.socket = io();
  this.clockInterval;
  this.navigationList;
  // this.navigationPushHeight = 0;
  this.projects = [];
  this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  this.monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  this.pageLock = false;
  this.lockRight = false;
  this.lockLeft = false;
  this.hasBuildErrors = false;
  this.buildParams = {
    statusInterval: null,
    latestFailed: null,
    latestBuild: null,
    failedBuilds: [],
    succeededBuilds: [],
    totalCount: 0
  };

  this.init = function() {
    this.setCurrentDate();

    //TODO: Remove after test
    $(document).unbind();
    $(document).keydown(function(e) {
      switch(e.which) {
          case 37: // left
          self.ngScope().currentPage.left();
          console.log('l');
          break;

          case 38: // up
          self.ngScope().currentPage.up();
          console.log('u');
          break;

          case 39: // right
          self.ngScope().currentPage.right();
          console.log('r');
          break;

          case 40: // down
          self.ngScope().currentPage.down();
          console.log('d');
          break;

          default: return;
      }
      e.preventDefault();
    });

    this.socket.removeListener('inputs_up');
    this.socket.on('inputs_up', function() {
      self.ngScope().currentPage.up();
    });

    this.socket.removeListener('inputs_down');
    this.socket.on('inputs_down', function() {
      self.ngScope().currentPage.down();
    });

    this.socket.removeListener('inputs_left');
    this.socket.on('inputs_left', function() {
      self.ngScope().currentPage.left();
    });

    this.socket.removeListener('inputs_right');
    this.socket.on('inputs_right', function() {
      self.ngScope().currentPage.right();
    });

    this.socket.removeListener('inputs_right');
    this.socket.on('inputs_right', function() {
      self.ngScope().currentPage.right();
    });

    this.socket.removeListener('set_builds');
    this.socket.on('set_builds', function(builds, hollaback) {
      setBuilds(builds, hollaback);
    });

    this.socket.removeListener('set_latest_build');
    this.socket.on('set_latest_build', function(build, hollaback) {
      setLatestBuild(build, hollaback);
    });

    this.socket.removeListener('set_latest_failed_build');
    this.socket.on('set_latest_failed_build', function(build, hollaback) {
      setLatestFailedBuild(build, hollaback)
    });

    self.socket.emit('get_builds', function(builds) {
      var builds = JSON.parse(builds);
      setBuilds(builds);
      setLatestBuild(builds[0]);
    });

    self.socket.emit('get_latest_failed_build', function(build) {
      var build = JSON.parse(build);
      setLatestFailedBuild(build);
    });
  };

  function setBuilds(builds, hollaback) {
    var isSuccess;
    try {
      self.buildParams.totalCount = builds.length;
      self.buildParams.failedBuilds = [];
      self.buildParams.succeededBuilds = [];

      if (builds.length > 0) {
        for (var i = 0; i < builds.length; i++) {
          var build = builds[i];
          if (build.Status === 'FAILURE') {
            self.buildParams.failedBuilds.push(build);
          } else if (build.Status === 'SUCCESS') {
            self.buildParams.succeededBuilds.push(build);
          }
        }
      }

      if (typeof Dashboard === 'object') {
        Dashboard.setBuildCount();
      }
      isSuccess = true;
    }
    catch(e) {
      isSuccess = false;
    }

    if (typeof(hollaback) == "function") {
      hollaback(isSuccess);
    }
  }

  function setLatestBuild(build, hollaback) {
    var isSuccess;
    try {
      self.buildParams.latestBuild = build;
      checkForBuildErrors();
      if (typeof Dashboard === 'object') {
        Dashboard.setLatestBuild();
      }
      if (typeof BuildStatus === 'object') {
        BuildStatus.setFailedBuilds();
      }
      isSuccess = true;
    }
    catch(e) {
      isSuccess = false;
    }

    if (typeof(hollaback) == "function") {
      hollaback(isSuccess);
    }
  }

  function setLatestFailedBuild(build, hollaback) {
    var isSuccess;
    try {
      self.buildParams.latestFailed = build;
      if (typeof Dashboard === 'object') {
        Dashboard.setLastFailedCounter();
      }
      isSuccess = true;
    }
    catch(e) {
      isSuccess = false;
    }

    if (typeof(hollaback) == "function") {
      hollaback(isSuccess);
    }
  }

  function checkForBuildErrors() {
    if (self.buildParams.failedBuilds.length > 0) {
      $('div.wrapper').addClass('failed');
      self.hasBuildErrors = true;
    } else {
      $('div.wrapper').removeClass('failed');
      self.hasBuildErrors = false;
    }
  }



  this.init();
}


Main.prototype.left = function() {
  var page = this;
  if (!page.pageLock) {
    page.ngScope().$apply(function() {
      page.ngScope().routeLeft();
    });
  }
}

Main.prototype.right = function() {
  var page = this;
  if (!page.pageLock) {
    page.ngScope().$apply(function() {
      page.ngScope().routeRight();
    });
  }
}

Main.prototype.ngScope = function() {
  var scope = angular.element($(".page-holder")).scope();
  return scope;
}

Main.prototype.removeListeners = function() {
  for (var i = 0; i < arguments.length; i++) {
    var listener = arguments[i];
    this.socket.removeListener(listener);
  }
}

Main.prototype.startSpinner = function() {
  this.stopSpinner();
  // var spinner = $('<div class="spinner">' +
  //                   '<div class="double-bounce1"></div>' +
  //                   '<div class="double-bounce2"></div>' +
  //                 '</div>');

  var spinner = $('<div class="spinner sk-folding-cube">' +
                    '<div class="sk-cube1 sk-cube"></div>' +
                    '<div class="sk-cube2 sk-cube"></div>' +
                    '<div class="sk-cube4 sk-cube"></div>' +
                    '<div class="sk-cube3 sk-cube"></div>' +
                  '</div>');

  spinner.appendTo('body');
}

Main.prototype.stopSpinner = function() {
  $('.spinner').remove();
}

Main.prototype.setCurrentDate = function() {
  if (this.clockInterval != null)
    return;

  var currentDate = new Date();
  var monthNr = currentDate.getMonth();
  var year = currentDate.getFullYear();
  var day = currentDate.getDate();

  var month = this.monthNamesShort[monthNr];
  var dateHolder = $('.date-time .date');

  dateHolder.find('.day').text(day);
  dateHolder.find('.month').text(month);
  dateHolder.find('.year').text(year);

  this.clockInterval = setInterval(function() {

    function r(el, deg) {
      el.setAttribute('transform', 'rotate('+ deg +' 50 50)')
    }
    var d = new Date()
    r($('#sec').get(0), 6*d.getSeconds())
    r($('#min').get(0), 6*d.getMinutes())
    r($('#hour').get(0), 30*(d.getHours()%12) + d.getMinutes()/2)
  }, 1000)
}

Main.prototype.up = function() {
  var list = this.ngScope().currentPage.navigationList;
  if (list !== undefined) {
    var activeItem = list.find('li.current');
    var activeIndex = list.find('li').index(activeItem);


    if (activeIndex === 0) {
      // list.find('li:last-child').addClass('current');
    } else {
      activeItem.removeClass('current');
      activeItem.prev('li').addClass('current');
      var pushHeight = list.css('margin-top').split('px')[0];
      pushHeight = parseFloat(pushHeight) + list.find('li').first().outerHeight();
      list.css('margin-top', pushHeight + 'px');
    }
  }
}

Main.prototype.down = function() {
  var list = this.ngScope().currentPage.navigationList;
  if (list !== undefined) {
    var totalCount = list.find('li').length;
    var activeItem = list.find('li.current');
    var activeIndex = list.find('li').index(activeItem);


    if (activeIndex === totalCount - 1) {
      // list.find('li:first-child').addClass('current');

    } else {
      activeItem.removeClass('current');
      activeItem.next('li').addClass('current');
      var pushHeight = list.css('margin-top').split('px')[0];
      pushHeight = parseFloat(pushHeight) + list.find('li').first().outerHeight() * -1;
      list.css('margin-top', pushHeight + 'px');
      // list.css('margin-top', this.navigationPushHeight + 'px');
    }
  }
}
