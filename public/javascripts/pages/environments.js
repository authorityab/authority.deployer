var Environments = (function() {



  $(function() {

    //TODO: Remove after test
    $(document).unbind();
    $(document).keydown(function(e) {
      switch (e.which) {

        case 13: // enter
          triggerDeploy();
          console.log('e');
          break;

        case 37: // left
          left();
          console.log('l');
          break;

        // case 39: // right
        //   right();
        //   console.log('r');
        //   break;

        default:
          return;
      }
      e.preventDefault();
    });

    setEnvironments();

  });



  function left() {
		Main.ngScope().$apply(function() {
			Main.ngScope().routeLeft();
		});
	}

	// function right() {
	// 	Main.ngScope().$apply(function() {
	// 		Main.ngScope().routeRight();
	// 	});
	// }

  function triggerDeploy() {
    var projectId = $('#projectId').val();
    var releaseId = $('#releaseId').val();

		var environments = $('ul#environments');

		console.log('button pushed');
		var environmentId = environments.find('li.active').data('environment-id');

		console.log('project id: ' + projectId);
    console.log('release id: ' + releaseId);
    console.log('environment id: ' + environmentId);

		Main.socket.emit('trigger_deploy', projectId, releaseId, environmentId);

		projects.find('[data-project-id="' + projectId + '"]').addClass('in-progress');
	}


  function setEnvironments() {
    var list = $('ul#environments');
    list.empty();

    for (var i = 0; i < environments.length; i++) {
      var environment = environments[i];
      var listItem = $('<li>' + i + '</li>');
      listItem.attr('data-environment-id', i);

      list.append(listItem);
    }
  }

  return {
    setEnvironments: setEnvironments
  }


})();
