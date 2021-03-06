angular.module('authorityDeployer.routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/dashboard.jade',
      controller: 'DashboardController'
    })
    .when('/build-status', {
      templateUrl: 'partials/build-status.jade',
      controller: 'BuildStatusController'
    })
    .when('/projects', {
      templateUrl: 'partials/projects.jade',
      controller: 'ProjectsController'
    })
    .when('/releases/:projectId', {
      templateUrl: 'partials/releases.jade',
      controller: 'ReleasesController'
    })
    .when('/environments/:projectId/:releaseId', {
      templateUrl: 'partials/environments.jade',
      controller: 'EnvironmentsController'
    });
    // .otherwise({
    //   redirectTo: '/'
    // });

    $locationProvider.html5Mode(true);
}]);
