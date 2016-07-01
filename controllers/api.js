var com = require('../source/communication');

var express = require('express');
var router = express.Router();

module.exports = function() {
  router.get('/', function(req, res, next) {
    res.send('api');
  });

  router.post('/setBuilds', function(req, res, next) {
    com.sockets.builds.set(req.body, function(isSuccess) {
      res.send({ success: isSuccess });
    });
  });

  router.post('/setLatestBuild', function(req, res, next) {
    com.sockets.builds.setLatest(req.body, function(isSuccess) {
      res.send({ success: isSuccess });
    });
  });

  router.post('/setLatestFailedBuild', function(req, res, next) {
    com.sockets.builds.setLatestFailed(req.body, function(isSuccess) {
      res.send({ success: isSuccess });
    });
  });

  return router;
}
