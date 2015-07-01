var controllers = angular.module('srDeployer.controllers', []);


controllers.controller('ProjectsController', function($scope, $location) {
  $scope.pageClass = 'projects-page';

  $scope.routeLeft = function() {
    $location.url('/status');
  }

  $scope.routeRight = function() {

  }

});

controllers.controller('StatusController', function($scope, $location) {
  $scope.pageClass = 'status-page';

  $scope.routeLeft = function() {

  }

  $scope.routeRight = function() {
      $location.url('/');
  }

});
