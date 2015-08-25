function BuildStatus() {
  Main.startSpinner();

  var buildList;

  $(function() {
    buildList = $('nav .project-list');
  });

  function setFailedBuilds() {
    var currentIndex = buildList.find('li.current').index();
    buildList.empty();

    for (var i = 0; i < Main.buildParams.failedBuilds.length; i++) {
      var build = Main.buildParams.failedBuilds[i];

      var listItem = $('<li><div>' +
											 	'<h2>' + build.ProjectName + '</h2>' +
										 		'<h3>' + build.StepName + '</h3>' +
												'<h4>' + build.LastBuild + '</h4>' +
										  '</div></li>');

      listItem.attr('class', 'error');
      buildList.append(listItem);
    }

    if (currentIndex > -1) {
      $(buildList.find('li')[currentIndex]).addClass('current');
    } else {
      buildList.find('li:first-child').addClass('current');
    }

    Main.stopSpinner();
  }

  return {
    list: buildList,
    setFailedBuilds: setFailedBuilds
  }
}
