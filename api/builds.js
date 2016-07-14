var com = require('../source/communication');

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
});

router.post('/latestFailed', function(req, res, next) {
  console.log('builds/latestFailed');
  com.sockets.builds.setLatestFailed(req.body, function(isSuccess) {
    res.send({ success: isSuccess });
  });
});

module.exports = router;
