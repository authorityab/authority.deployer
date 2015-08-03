var Main = (function() {
    var socket = io();

    var ngScope = function() {
      var scope = angular.element($("#wrapper")).scope();
      return scope;
    };

    var buildParams = {
      statusInterval: null,
      latestFailed: null,
      // allSucceeded: false,
      failedBuilds: []
    };



    buildParams.statusInterval = setInterval(function() {
      socket.emit('get_build_status');
    }, 10000);


    socket.on('set_build_status', function(data) {
      buildParams.failedBuilds = [];

      var builds = JSON.parse(JSON.parse(data));
      for (var i = 0; i < builds.length; i++) {
        var build = builds[i];

        if (build.Status === 'SUCCESS') { 
          buildParams.failedBuilds.push(build);
        }
        // else if (build.Status === 'SUCCESS') {
        //    buildParams.succeededBuilds.push(build);
        // }
      }

      if (!buildParams.failedBuilds.length > 0) {
        socket.emit('get_latest_failed_build');
      }

      if (buildParams.failedBuilds.length > 0 && typeof BuildStatus !== 'undefined') {
        BuildStatus.setFailedBuilds();
      }

    });

    socket.on('set_latest_failed_build', function(build) {
      buildParams.latestFailed = JSON.parse(JSON.parse(build));

        if (buildParams.failedBuilds.length > 0 && typeof Dashboard !== 'undefined') {
          Dashboard.setLatestFailedBuild();
        }
    });



    return {
      socket: socket,
      ngScope: ngScope,
      buildParams: buildParams
    }
})();
