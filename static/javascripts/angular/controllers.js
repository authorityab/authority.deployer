function BuildStatusController($scope, $location) {
  $scope.pageId = 'fails_view';
  $scope.pageClass = 'view fails';
  $scope.currentPage = BuildStatus;

  $scope.routeLeft = function() {
  }

  $scope.routeRight = function() {
      $location.url('/');
  }
}

function DashboardController($scope, $location) {
  $scope.pageId = 'dash_view';
  $scope.pageClass = 'dash-projects';
  $scope.currentPage = Dashboard;

  $scope.routeLeft = function() {
    $location.url('/build-status');
  }

  $scope.routeRight = function() {
    $location.url('/projects');
  }
}

function ProjectsController($scope, $location) {
  $scope.pageId = 'projects_view';
  $scope.pageClass = 'view projects';
  $scope.currentPage = Projects;

  $scope.routeLeft = function() {
    $location.url('/');
  }

  $scope.routeRight = function(projectId) {
    $location.url('/releases/' + projectId);
  }
}

function ReleasesController($scope, $location, $routeParams) {
  $scope.pageId = 'project_view';
  $scope.pageClass = 'view project';
  $scope.projectId = $routeParams.projectId;
  $scope.currentPage = Releases;

  $scope.routeLeft = function() {
    $location.url('/projects');
  }

  $scope.routeRight = function(projectId, releaseId) {
    $location.url('/environments/' + projectId + '/' + releaseId);
  }
}

function EnvironmentsController($scope, $location, $routeParams) {
  $scope.pageId = 'project_view';
  $scope.pageClass = 'view project';
  $scope.projectId = $routeParams.projectId;
  $scope.releaseId = $routeParams.releaseId;
  $scope.currentPage = Environments;

  $scope.routeLeft = function() {
    $location.url('/releases/' + $routeParams.projectId);
  }

  $scope.routeRight = function() {
    $location.url('/');
  }
}

BuildStatusController.$inject = ['$scope', '$location'];
DashboardController.$inject = ['$scope', '$location'];
ProjectsController.$inject = ['$scope', '$location'];
ReleasesController.$inject = ['$scope', '$location', '$routeParams'];
EnvironmentsController.$inject = ['$scope', '$location', '$routeParams'];

angular.module('authorityDeployer.controllers', [])
  .controller('BuildStatusController', BuildStatusController)
  .controller('DashboardController', DashboardController)
  .controller('ProjectsController', ProjectsController)
  .controller('ReleasesController', ReleasesController)
  .controller('EnvironmentsController', EnvironmentsController);
