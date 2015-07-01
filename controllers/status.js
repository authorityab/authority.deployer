var com = require('../lib/communication');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('status/index');
});

router.post('/set', function(req, res, next) {
    com.sockets.status.set(req.body.projects);

    res.end();
});

module.exports = router;
