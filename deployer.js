/// <reference path="typings/node/node.d.ts"/>

var fs = require('fs');
var fsExtra = require('fs.extra');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compass = require('node-compass');
var buildify = require('buildify');

var app = express();

var staticDevPath = path.join(__dirname, 'public');
var staticProPath = path.join(__dirname, 'public_dist');

//TODO: Uglify in production, Copy images and styles to public_dist
if (app.get('env') === 'production') {
  buildify()
   .concat([ '/public/libs/jquery/dist/jquery.min.js',
             '/public/libs/angular/angular.js',
             '/public/libs/angular-route/angular-route.js',
             '/public/javascripts/angular/routes.js',
             '/public/javascripts/angular/controllers.js',
             '/public/javascripts/angular/app.js',
             '/public/javascripts/main.js',
             '/public/javascripts/pages/dashboard.js',
             '/public/javascripts/pages/build-status.js',
             '/public/javascripts/pages/projects.js',
             '/public/javascripts/pages/releases.js',
             '/public/javascripts/pages/environments.js'])
   .save('/public/javascripts/script.js');
  //  .uglify()
  //  .save('/public/javascripts/script.min.js');

  //  fsExtra.copy('/public/stylesheets/style.css', '/public_dist/stylesheets/style.css', { replace: true }, function(err) {
  //    if (err) {
  //      throw err;
  //    }
  //  });

   app.use(express.static(staticDevPath));
   app.use(favicon(staticDevPath + '/images/favicon.ico'));
 }
 // else {
 //   app.use(express.static(staticDevPath));
 //   app.use(favicon(staticDevPath + '/images/favicon.ico'));
 // }


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compass({ mode: 'compress' }));


function initControllers(com) {
  var indexController = require('./controllers/index');
  var apiController = require('./controllers/api')(com);

  app.use('/api', apiController);
  app.use('/', indexController);
}

module.exports = { app: app, initControllers: initControllers };
