var BuildStatus = (function() {



  $(function() {

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

    setFailedBuilds();

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


  function setFailedBuilds() {
    var list = $('ul#failed-builds');
    list.empty();

    for (var i = 0; i < Main.buildParams.failedBuilds.length; i++) {
      var build = Main.buildParams.failedBuilds[i];

      var changedBy = 'Anonymous';
      if (build.Changes != null && build.Changes.Change.length !== 0) {
        changedBy = build.Changes.Change[0].Username;
      }


      var listItem = $('<li>' + build.BuildConfig.ProjectName + ' ¶ ' + build.BuildConfig.Name + ' ¶ ' + changedBy + '</li>');
      listItem.attr('class', 'error'); // build.Status === 'SUCCESS' ? "success" : "error"
      list.append(listItem);
    }
  }

  return {
    setFailedBuilds: setFailedBuilds
  }


})();
