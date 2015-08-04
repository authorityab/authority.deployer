var Dashboard = (function() {

  $(function() {

    //TODO: Remove after test
    $(document).on('click', '#success', function(){
			Main.socket.emit('deploy_succeeded');
		});
		$(document).on('click', '#error', function(){
			Main.socket.emit('deploy_failed');
		});
		$(document).on('click', '#loading', function(){
			Main.socket.emit('trigger_deploy');
		});
		$(document).on('click', '#stop', function(){
			Main.socket.emit('ledstrip_stop');
		});

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


    setLatestFailedBuild();

  });


  function left() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeLeft();
		});
	}

	function right() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeRight();
		});
	}


  function setLatestFailedBuild() {
    if (Main.buildParams.latestFailed != null) {
      $('#build-destroyer').html(Main.buildParams.latestFailed);
    }
  }

  return {
    setLatestFailedBuild: setLatestFailedBuild
  }



})();
