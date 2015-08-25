var Main = (function() {
  var socket = io();

  var currentPage;
  var pageLock = false;
  var lockRight = false;
  var lockLeft = false;

  var buildParams = {
    statusInterval: null,
    latestFailed: null,
    latestBuild: null,
    failedBuilds: [],
    succeededBuilds: [],
    totalCount: 0
  };

  var projects = [];

  //TODO: Remove after test
  $(document).unbind();
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        ngScope().currentPage.left === undefined ? left() : ngScope().currentPage.left();
        console.log('l');
        break;

        case 38: // up
        ngScope().currentPage.up === undefined ? up() : ngScope().currentPage.up();
        console.log('u');
        break;

        case 39: // right
        ngScope().currentPage.right === undefined ? right() : ngScope().currentPage.right();
        console.log('r');
        break;

        case 40: // down
        ngScope().currentPage.down === undefined ? down() : ngScope().currentPage.down();
        console.log('d');
        break;

        default: return;
    }
    e.preventDefault();
  });

  socket.removeListener('inputs_up');
  socket.on('inputs_up', function() {
    ngScope().currentPage.up === undefined ? up() : ngScope().currentPage.up();
  });

  socket.removeListener('inputs_down');
  socket.on('inputs_down', function() {
    ngScope().currentPage.down === undefined ? down() : ngScope().currentPage.down();
  });

  socket.removeListener('inputs_left');
  socket.on('inputs_left', function() {
    ngScope().currentPage.left === undefined ? left() : ngScope().currentPage.left();
  });

  socket.removeListener('inputs_right');
  socket.on('inputs_right', function() {
    ngScope().currentPage.right === undefined ? right() : ngScope().currentPage.right();
  });

  function setBuildStatus(data) {
    var builds = JSON.parse(JSON.parse(data));

    buildParams.totalCount = builds.length;
    buildParams.failedBuilds = [];
    buildParams.succeededBuilds = [];

    if (builds.length > 0) {
      buildParams.latestBuild = builds[0];

      for (var i = 0; i < builds.length; i++) {
        var build = builds[i];

        if (build.Status === 'FAILURE') {
          buildParams.failedBuilds.push(build);
        } else if (build.Status === 'SUCCESS') {
          buildParams.succeededBuilds.push(build);
        }
      }
    }

    if (buildParams.failedBuilds.length > 0) {
      socket.emit('get_latest_failed_build', function(build) {
        buildParams.latestFailed = JSON.parse(JSON.parse(build));
      });

      if (typeof BuildStatus !== 'undefined') {
        BuildStatus.setFailedBuilds();
      }

      if (typeof Dashboard !== 'undefined') {
        Dashboard.checkForBuildErrors();
      }
    }

    if (typeof Dashboard !== 'undefined') {
      Dashboard.setLatestBuild();
      Dashboard.setBuildCount();
      Dashboard.setLastFailedCounter();
    }
  }

  buildParams.statusInterval = setInterval(function() {
    socket.emit('get_build_status', function (status) {
      setBuildStatus(status);
    });
  }, 10000);

  function ngScope() {
    var scope = angular.element($(".wrapper")).scope();
    return scope;
  };



  function removeListeners() {
    for (var i = 0; i < arguments.length; i++) {
      var listener = arguments[i];
      socket.removeListener(listener);
    }
  }

  function startSpinner() {
    stopSpinner();
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

  function stopSpinner() {
    $('.spinner').remove();
  }

  function up() {
    var list = ngScope().currentPage.list;
    if (list !== undefined) {
      var activeItem = list.find('li.current');
  		var activeIndex = list.find('li').index(activeItem);

  		activeItem.removeClass('current');
  		if (activeIndex === 0) {
  			list.find('li:last-child').addClass('current');
  		} else {
  			activeItem.prev('li').addClass('current');
  		}
    }
	}

	function down() {
    var list = ngScope().currentPage.list;
    if (list !== undefined) {
  		var totalCount = list.find('li').length;
  		var activeItem = list.find('li.current');
  		var activeIndex = list.find('li').index(activeItem);

  		activeItem.removeClass('current');
  		if (activeIndex === totalCount - 1) {
  			list.find('li:first-child').addClass('current');
  		} else {
  			activeItem.next('li').addClass('current');
  		}
    }
	}

  function left() {
		if (!pageLock) {
			ngScope().$apply(function() {
				ngScope().routeLeft();
			});
		}
	}

	function right() {
		if (!pageLock) {
			ngScope().$apply(function() {
				ngScope().routeRight();
			});
		}
	}

  return {
    currentPage: currentPage,
    socket: socket,
    pageLock: pageLock,
    lockRight: lockRight,
    lockLeft: lockLeft,
    ngScope: ngScope,
    removeListeners: removeListeners,
    startSpinner: startSpinner,
    stopSpinner: stopSpinner,
    buildParams: buildParams,
    projects: projects
  }
})();
