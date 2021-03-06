function Dashboard() {
  var self = this;
  this.lastSuccessCount = 0;
  this.lastFailedCount = 0;
  this.buildTimer = null;
  this.timerLock = false;

  this.init = function() {
      self.socket.emit('loading_stop');

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
      buildHolder.attr('data-builder', this.buildParams.latestBuild.LastModifiedBy);

      if (this.buildParams.latestBuild.Status === 'SUCCESS') {
        buildHolder.removeClass('build-fail');
        buildHolder.addClass('build-success');
      } else {
        buildHolder.removeClass('build-success');
        buildHolder.addClass('build-fail');
      }

      if (!this.timerLock) {
        var buildTimer = this.blink(buildHolder);
        this.timerLock = true;
        setTimeout(function() {
          self.timerLock = false;
          self.stopBlink(buildHolder, buildTimer);
        }, 5000);
      }
    }
  };

  this.setBuildCount = function() {
    var totalCount = this.buildParams.totalCount;
    var successCount = this.buildParams.succeededBuilds.length;
    var failedCount = this.buildParams.failedBuilds.length;

    var successHolder = $('.p-success.dash-stat h1');
    var failedHolder = $('.p-fail.dash-stat h1');

    if (this.lastSuccessCount  !== successCount) {
      successHolder.text(successCount);
      // var successTimer = this.blink(successHolder);
      //
      // setTimeout(function() {
      //   self.stopBlink(successHolder, successTimer);
      // }, 5000)
    }
    if (this.lastFailedCount  !== failedCount) {
      failedHolder.text(failedCount);
      // var failTimer = this.blink(failedHolder);
      //
      // setTimeout(function() {
      //   self.stopBlink(failedHolder, failTimer);
      // }, 5000)
    }
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
