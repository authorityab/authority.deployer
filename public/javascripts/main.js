var Main = (function() {

    var currentPage;
    var socket = io();

    var ngScope = function() {
      var scope = angular.element($(".wrapper")).scope();
      return scope;
    };

    var buildParams = {
      statusInterval: null,
      latestFailed: null,
      latestBuild: null,
      failedBuilds: [],
      succeededBuilds: [],
      totalCount: 0
    };

    var projectParams = {
      currentProject: null,
      projects: []
    };

    var releaseParams = {
      currentRelease: null,
      releases: []
    };

    var environmentParams = {
      environments: []
    };

    var deployParams = {
      latestDeploys: [],
      latestDeployTasks: []
    };



    // setTimeout(function() {

      // if (typeof Dashboard !== 'undefined') {
      //   currentPage = Dashboard;
      // } else if (typeof BuildStatus !== 'undefined') {
      //   currentPage = BuildStatus;
      // } else if (typeof Projects !== 'undefined') {
      //   currentPage = Projects;
      // } else if (typeof Releases !== 'undefined') {
      //   currentPage = Releases;
      // } else if (typeof Environments !== 'undefined') {
      //   currentPage = Environments;
      // }

      //TODO: Remove after test
  		$(document).unbind();
  		$(document).keydown(function(e) {
  	    switch(e.which) {



  	        case 37: // left
  					ngScope().currentPage.left();
  					console.log('l');
  	        break;

  					case 38: // up
  					ngScope().currentPage.up();
  					console.log('u');
  	        break;

  	        case 39: // right
  					ngScope().currentPage.right();
  					console.log('r');
  	        break;

  					case 40: // down
  					ngScope().currentPage.down();
  					console.log('d');
  	        break;

  	        default: return;
  	    }
      	e.preventDefault();
  		});
  // }, 1000);

  socket.emit('get_latest_failed_build');

  socket.removeListener('inputs_up');
  socket.on('inputs_up', function() {
    Main.currentPage.up();
  });

  socket.removeListener('inputs_down');
  socket.on('inputs_down', function() {
    Main.currentPage.down();
  });

  socket.removeListener('inputs_left');
  socket.on('inputs_left', function() {
    Main.currentPage.left();
  });

  socket.removeListener('inputs_right');
  socket.on('inputs_right', function() {
    Main.currentPage.right();
  });


  buildParams.statusInterval = setInterval(function() {
    socket.emit('get_build_status');
  }, 10000);





  socket.on('set_build_status', function(data) {
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
      socket.emit('get_latest_failed_build');

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


  });

  socket.on('set_latest_failed_build', function(build) {
    buildParams.latestFailed = JSON.parse(JSON.parse(build));
    // Dashboard.setLastFailedCounter();
  });



  // socket.emit('get_environments');
  // socket.on('set_environments', function(data) {
  //
  //   var environments =  JSON.parse(JSON.parse(data));
  //   environmentParams.environments = environments;
  //
  //   if (environmentParams.environments.length > 0 && typeof Environments !== 'undefined') {
  // 		Environments.setEnvironments();
  //   }
  // });





return {
  currentPage: currentPage,
  socket: socket,
  ngScope: ngScope,
  buildParams: buildParams,
  projectParams: projectParams,
  releaseParams: releaseParams,
  environmentParams: environmentParams,
  deployParams: deployParams
}
})();
