// var routes = angular.module('srDeployer.routes', []);

angular.module('srDeployer.routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/projects.jade',
      controller: 'NavigationController'
    })
    .when('/status', {
      templateUrl: 'partials/status.jade',
      controller: 'NavigationController'
    })
    .otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
}]);
