var express = require('express');
var router = express.Router();

router.get('/partials/:name', function(req, res, next) {
  var name = req.params.name;
  if (!name) return;
  res.render('partials/' + name);
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('*', function(req, res, next) {
  res.render('index');
});





module.exports = router;
