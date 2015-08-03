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

  $scope.routeRight = function() {
    $location.url('/environments');
  }

});

controllers.controller('EnvironmentsController', function($scope, $location) {
  $scope.pageClass = 'environments-page';

  $scope.routeLeft = function() {
    $location.url('/projects');
  }

  $scope.routeRight = function() {
  }

});
