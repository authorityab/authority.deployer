var com = require('../source/communication');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('api');
  com.sockets.test.debug(function(msg) {
    res.send('res: ' + msg);
  });
});

router.post('/setBuilds', function(req, res, next) {
  console.log('setBuilds');
  com.sockets.builds.set(req.body, function(isSuccess) {
    res.send({ success: isSuccess });
  });
});

router.post('/setLatestBuild', function(req, res, next) {
  console.log('setBuilds');
  com.sockets.builds.setLatest(req.body, function(isSuccess) {
    res.send({ success: isSuccess });
  });
});

router.post('/setLatestFailedBuild', function(req, res, next) {
  console.log('setBuilds');
  com.sockets.builds.setLatestFailed(req.body, function(isSuccess) {
    res.send({ success: isSuccess });
  });
});

module.exports = router;
