function Dashboard() {
  var self = this;

  this.init = function() {

      this.stopSpinner();

      //TODO: Remove after test
      $(document).on('click', '#success', function(){
  			self.socket.emit('arm_deploy_button');
  		});
  		$(document).on('click', '#error', function(){
  			self.socket.emit('disarm_deploy_button');
  		});
  		// $(document).on('click', '#loading', function(){
  		// 	Main.socket.emit('trigger_deploy');
  		// });
  		$(document).on('click', '#stop', function(){
  			self.socket.emit('ledstrip_stop');
  		});

      setTimeout(function() {
        self.setLatestBuild();
        self.setBuildCount();
        self.setLastFailedCounter();
      }, 300);

      setInterval(function() {
        self.setLastFailedCounter();
      }, 60000)
  };

  this.setLatestBuild = function() {
    if (this.buildParams.latestBuild != null) {
      var finishDate = new Date(this.buildParams.latestBuild.FinishDate);
      var monthNr = finishDate.getMonth();
      var year = finishDate.getFullYear();
      var day = finishDate.getDate();
      var hours = finishDate.getHours();
      var minutes = finishDate.getMinutes();

      if (hours < 10)
        hours = "0" + hours;

      if (minutes < 10)
        minutes = "0" + minutes;

      var month = this.monthNamesShort[monthNr];

      var buildHolder = $('.dash-latest');
      buildHolder.find('h1').text(day);
      buildHolder.find('h3').text(month);
      buildHolder.find('h4').text(hours + ':' + minutes);

      buildHolder.find('.l-description').text(this.buildParams.latestBuild.ProjectName + ' - ' + this.buildParams.latestBuild.StepName);

      if (this.buildParams.latestBuild.Status === 'SUCCESS') {
        buildHolder.removeClass('fail');
        buildHolder.addClass('success');
      } else {
        buildHolder.removeClass('success');
        buildHolder.addClass('fail');
      }
    }
  };

  this.setBuildCount = function() {
    var totalCount = this.buildParams.totalCount;
    var successCount = this.buildParams.succeededBuilds.length;
    var failedCount = this.buildParams.failedBuilds.length;

    $('.p-success.dash-stat h1').text(successCount);
    $('.p-fail.dash-stat h1').text(failedCount);
  };

  this.setLastFailedCounter = function() {
    if (this.buildParams.latestFailed != null) {
      var currentDate = new Date();
      var failedDate = this.buildParams.latestFailed.FinishDate;
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

      countHolder.find('.failer .name').text(this.buildParams.latestFailed.LastModifiedBy);
    }
  };

  this.left = function() {
    var page = this;
    if (page.hasBuildErrors) {
      page.ngScope().$apply(function() {
        page.ngScope().routeLeft();
      });
    }
  };

  this.init();
}
