var express = require('express');
var router = express.Router();


router.use('/status', require('./status'));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});



module.exports = router;
