var sockets = require('../lib/websockets');
var express = require('express');
var router = express.Router();


router.use('/status', require('./status'));


router.get('/', function(req, res, next) {
  
  // TODO: Make a request to the .net service to get a list of all projects and statuses. Maybe 
  
  var projects = [
    { id: 0, name: 'Project 1', status: Math.round(Math.random()) },
    { id: 1, name: 'Project 2', status: Math.round(Math.random()) },
    { id: 2, name: 'Project 3', status: Math.round(Math.random()) },
    { id: 3, name: 'Project 4', status: Math.round(Math.random()) }
  ];
    
  res.render('index', { title: 'SoftResource Project Status', projects: projects });
});



module.exports = router;
