function dashboard() {

  var clockInterval;
  var lastFailedInterval;
  var hasBuildErrors = false;
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  $(function() {

    console.log('DASHBOARD LOAD');
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

    setTimeout(function() {
      setLatestBuild();
      setBuildCount();
      setCurrentDate();
      setLastFailedCounter();
    }, 300);


    // lastFailedInterval = setInterval(function() {
    //   setLastFailedCounter();
    // }, 60000);

  });
    // //TODO: Remove after test
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






function clearIntervals() {
  console.log('clear interval ' + clockInterval + " " + lastFailedInterval);
  clearInterval(clockInterval);
  clearInterval(lastFailedInterval);
  console.log('clear interval 2 ' + clockInterval + " " + lastFailedInterval);
}

  function up() {
    // TODO: something to do here?
  }

  function down() {
    // TODO: something to do here?
  }

  function left() {
    clearIntervals();

    if (hasBuildErrors) {
      Main.ngScope().$apply(function() {
  			Main.ngScope().routeLeft();
  		});
    }
	}

	function right() {
    clearIntervals();

		Main.ngScope().$apply(function() {
			Main.ngScope().routeRight();
		});
	}

  function setCurrentDate() {
    var currentDate = new Date();
    var monthNr = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var day = currentDate.getDate();

    var month = monthNamesShort[monthNr];

    var dateHolder = $('.date-time .date');
    dateHolder.find('.day').text(day);
    dateHolder.find('.month').text(month);
    dateHolder.find('.year').text(year);

    clockInterval = setInterval(function() {
      function r(el, deg) {
        el.setAttribute('transform', 'rotate('+ deg +' 50 50)')
      }
      var d = new Date()

      r($('#sec').get(0), 6*d.getSeconds())
      r($('#min').get(0), 6*d.getMinutes())
      r($('#hour').get(0), 30*(d.getHours()%12) + d.getMinutes()/2)
    }, 1000)
  }


  function setLatestBuild() {
    if (Main.buildParams.latestBuild != null) {
      var finishDate = new Date(Main.buildParams.latestBuild.FinishDate);
      var monthNr = finishDate.getMonth();
      var year = finishDate.getFullYear();
      var day = finishDate.getDate();

      var month = monthNamesShort[monthNr];

      var buildHolder = $('.dash-latest');
      buildHolder.find('h1').text(day);
      buildHolder.find('h3').text(month);

      buildHolder.find('.l-description').text(Main.buildParams.latestBuild.ProjectName + ' - ' + Main.buildParams.latestBuild.StepName);

      if (Main.buildParams.latestBuild.Status === 'SUCCESS') {
        buildHolder.removeClass('fail');
        buildHolder.addClass('success');
      } else {
        buildHolder.removeClass('success');
        buildHolder.addClass('fail');
      }
    }
  }

  function setBuildCount() {
    var totalCount = Main.buildParams.totalCount;
    var successCount = Main.buildParams.succeededBuilds.length;
    var failedCount = Main.buildParams.failedBuilds.length;

    $('.p-success.dash-stat h1').text(successCount);
    $('.p-fail.dash-stat h1').text(failedCount);
      // $('#build-destroyer').html(Main.buildParams.latestFailed);

  }

  function setLastFailedCounter() {
    if (Main.buildParams.latestFailed != null) {
      var currentDate = new Date();

      var failedDate = Main.buildParams.latestFailed.Build.FinishDate;

      var diffMilli = Math.floor(currentDate - new Date(failedDate));

      var seconds = (diffMilli / 1000) | 0;
      diffMilli -= seconds * 1000;

      var minutes = (seconds / 60) | 0;
      seconds -= minutes * 60;

      var hours = (minutes / 60) | 0;
      minutes -= hours * 60;

      var days = (hours / 24) | 0;
      hours -= days * 24;

      var weeks = (days / 7) | 0;
      days -= weeks * 7;

      var countHolder = $('.count-up');
      countHolder.find('#f_weeks').text(weeks);
      countHolder.find('#f_days').text(days);
      countHolder.find('#f_hours').text(hours);
      countHolder.find('#f_minutes').text(minutes);

      countHolder.find('.failer .name').text(Main.buildParams.latestFailed.BuildDestroyer);
    }
  }

  function checkForBuildErrors() {
    if (Main.buildParams.failedBuilds.length > 0) {
      $('main').addClass('failed');
      hasBuildErrors = true;
    } else {
      $('main').removeClass('failed');
      hasBuildErrors = false;
    }
  }





  return {
    up: up,
		down: down,
		left: left,
		right: right,
    setLastFailedCounter: setLastFailedCounter,
    setLatestBuild: setLatestBuild,
    setBuildCount: setBuildCount,
    checkForBuildErrors: checkForBuildErrors
  }



} //)();

// var Dashboard = new dashboard();
