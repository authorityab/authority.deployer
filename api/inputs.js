var com = require('../source/communication');

var express = require('express');
var router = express.Router();

router.post('/up', function(req, res, next) {
  console.log('api up');
  com.sockets.inputs.up();
  res.send({ success: true });
});

router.post('/down', function(req, res, next) {
  console.log('api up');
  com.sockets.inputs.up();
  res.send({ success: true });
});

router.post('/left', function(req, res, next) {
  console.log('api left');
  com.sockets.inputs.left();
  res.send({ success: true });
});

router.post('/right', function(req, res, next) {
  console.log('api right');
  com.sockets.inputs.right();
  res.send({ success: true });
});

router.post('/button', function(req, res, next) {
  console.log('api button');
  com.sockets.inputs.button();
  res.send({ success: true });
});

module.exports = router;
