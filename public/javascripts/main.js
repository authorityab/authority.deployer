var Main = (function() {
    var socket = io();

    var ngScope = function() {
      var scope = angular.element($("#wrapper")).scope();
      return scope;
    };

    return {
      socket: socket,
      ngScope: ngScope
    }
})();
