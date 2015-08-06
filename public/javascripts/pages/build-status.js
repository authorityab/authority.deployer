function buildStatus() {

  var buildList;

  $(function() {

    buildList = $('nav .project-list');
    //TODO: Remove after test
    // $(document).unbind();
    // $(document).keydown(function(e) {
    //   switch (e.which) {
    //     case 37: // left
    //       left();
    //       console.log('l');
    //       break;
    //
    //     case 39: // right
    //       right();
    //       console.log('r');
    //       break;
    //
    //     default:
    //       return;
    //   }
    //   e.preventDefault();
    // });

    setFailedBuilds();

  });


  function up() {
		var activeItem = buildList.find('li.current');
		var activeIndex = buildList.find('li').index(activeItem);

		activeItem.removeClass('current');

		if (activeIndex === 0) {
			buildList.find('li:last-child').addClass('current');
		} else {
			activeItem.prev('li').addClass('current');
		}
	}

	function down() {
		var totalCount = buildList.find('li').length;
		var activeItem = buildList.find('li.current');
		var activeIndex = buildList.find('li').index(activeItem);

		activeItem.removeClass('current');

		if (activeIndex === totalCount - 1) {
			buildList.find('li:first-child').addClass('current');
		} else {
			activeItem.next('li').addClass('current');
		}
	}

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
    // var list = $('ul#failed-builds');
    buildList.empty();

    for (var i = 0; i < Main.buildParams.failedBuilds.length; i++) {
      var build = Main.buildParams.failedBuilds[i];
      // var changedBy = 'Anonymous';
      // if (build.Changes != null && build.Changes.Change.length !== 0) {
      //   changedBy = build.Changes.Change[0].Username;
      // }

      var listItem = $('<li><div>' +
											 	'<h2>' + build.ProjectName + '</h2>' +
										 		'<h3>' + build.StepName + '</h3>' +
												'<h4>' + build.LastBuild + '</h4>' +
										  '</div></li>');

      // var changedBy = 'Anonymous';
      // if (build.Changes != null && build.Changes.Change.length !== 0) {
      //   changedBy = build.Changes.Change[0].Username;
      // }


      // var listItem = $('<li>' + build.BuildConfig.ProjectName + ' ¶ ' + build.BuildConfig.Name + ' ¶ ' + changedBy + '</li>');
      listItem.attr('class', 'error'); // build.Status === 'SUCCESS' ? "success" : "error"
      buildList.append(listItem);
    }

    buildList.find('li:first-child').addClass('current');
  }

  return {
    up: up,
		down: down,
		left: left,
		right: right,
    setFailedBuilds: setFailedBuilds
  }


} //)();


// var BuildStatus = new buildStatus();
// Main.currentPage = BuildStatus;
