var express = require('express');
var router = express.Router();
//var sockets = require('../classes/websockets');

router.get('/', function(req, res, next) {
  res.render('status/index');
});

router.get('/set', function(req, res, next) {
  //sockets.sendStatus('testing');
  res.send('status/set');
  
});

module.exports = router;
