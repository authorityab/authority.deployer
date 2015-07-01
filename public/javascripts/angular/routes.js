// var routes = angular.module('srDeployer.routes', []);

angular.module('srDeployer.routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/projects.jade',
      controller: 'ProjectsController'
    })
    .when('/status', {
      templateUrl: 'partials/status.jade',
      controller: 'StatusController'
    })
    .otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
}]);
