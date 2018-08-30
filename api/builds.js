var com = require('../lib/communication');

var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log('builds/');
  com.sockets.builds.set(req.body, function(isSuccess) {
    res.send({ success: isSuccess });
  });
});

router.post('/latest', function(req, res, next) {
  console.log('builds/latest');
  com.sockets.builds.setLatest(req.body, function(isSuccess) {
    res.send({ success: isSuccess });
  });

  var build = req.body;
  if (build.Status === 'FAILURE') {
    com.sockets.socket.emit('build_failed');
  } else if (build.Status === 'SUCCESS') {
    com.sockets.socket.emit('build_succeeded');
  }
});

router.post('/latestFailed', function(req, res, next) {
  console.log('builds/latestFailed');
  com.sockets.builds.setLatestFailed(req.body, function(isSuccess) {
    res.send({ success: isSuccess });
  });
});

module.exports = router;
