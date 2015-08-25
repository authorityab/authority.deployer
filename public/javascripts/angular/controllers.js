var controllers = angular.module('srDeployer.controllers', []);

controllers.controller('BuildStatusController', function($scope, $location) {
  $scope.pageId = 'fails_view';
  $scope.pageClass = 'view fails';

  var buildStatus = new BuildStatus();
  $scope.currentPage = buildStatus;

  $scope.routeLeft = function() {

  }

  $scope.routeRight = function() {
      $location.url('/');
  }
});

controllers.controller('DashboardController', function($scope, $location) {
  $scope.pageId = 'main_view';
  $scope.pageClass = 'view dash';

  Dashboard = new Dashboard();
  $scope.currentPage = Dashboard;

  $scope.routeLeft = function() {
    $location.url('/build-status');
  }

  $scope.routeRight = function() {
    $location.url('/projects');
  }
});

controllers.controller('ProjectsController', function($scope, $location) {
  $scope.pageId = 'projects_view';
  $scope.pageClass = 'view projects';

  Projects = new Projects();
  $scope.currentPage = Projects;

  $scope.routeLeft = function() {
    $location.url('/');
  }

  $scope.routeRight = function(projectId) {
    $location.url('/releases/' + projectId);
  }
});

controllers.controller('ReleasesController', function($scope, $location, $routeParams) {
  $scope.pageId = 'project_view';
  $scope.pageClass = 'view project';
  $scope.projectId = $routeParams.projectId;

  Releases = new Releases();
  $scope.currentPage = Releases;

  $scope.routeLeft = function() {
    $location.url('/projects');
  }

  $scope.routeRight = function(projectId, releaseId) {
    $location.url('/environments/' + projectId + '/' + releaseId);
  }
});

controllers.controller('EnvironmentsController', function($scope, $location, $routeParams) {
  $scope.pageId = 'project_view';
  $scope.pageClass = 'view project';
  $scope.projectId = $routeParams.projectId;
  $scope.releaseId = $routeParams.releaseId;

  Environments = new Environments();
  $scope.currentPage = Environments;

  $scope.routeLeft = function() {
    $location.url('/releases/' + $routeParams.projectId);
  }

  $scope.routeRight = function() {
    $location.url('/');
  }
});
