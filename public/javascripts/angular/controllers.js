var controllers = angular.module('srDeployer.controllers', []);




controllers.controller('BuildStatusController', function($scope, $location) {
  $scope.pageClass = 'build-status-page';

  $scope.routeLeft = function() {

  }

  $scope.routeRight = function() {
      $location.url('/');
  }

});

controllers.controller('DashboardController', function($scope, $location) {
  $scope.pageClass = 'dashboard-page';

  $scope.routeLeft = function() {
    $location.url('/build-status');
  }

  $scope.routeRight = function() {
    $location.url('/projects');
  }

});

controllers.controller('ProjectsController', function($scope, $location) {
  $scope.pageClass = 'projects-page';

  $scope.routeLeft = function() {
    $location.url('/');
  }

  $scope.routeRight = function(projectId) {
    $location.url('/releases#' + projectId);
  }

});

controllers.controller('ReleasesController', function($scope, $location) {
  $scope.pageClass = 'releases-page';
  $scope.projectId = $location.hash();

  $scope.routeLeft = function() {
    $location.url('/projects');
  }

  $scope.routeRight = function(projectId, releaseId) {
    $location.url('/environments?projectId=' + projectId + '&releaseId=' + releaseId);
  }

});

controllers.controller('EnvironmentsController', function($scope, $location) {
  $scope.pageClass = 'environments-page';
  $scope.projectId = $location.search('projectId');
  $scope.releaseId = $location.search('releaseId');

  $scope.routeLeft = function() {
    $location.url('/releases#' + $scope.projectId);
  }

  $scope.routeRight = function() {
  }

});
