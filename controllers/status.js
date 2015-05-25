var communication = require('../lib/communication');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('status/index');
});

router.post('/set', function(req, res, next) {
    communication.websockets.status.set(req.body.projects);
    
    res.end();
});

module.exports = router;
