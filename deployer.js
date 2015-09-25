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
// var uglifyJs = require('uglify-js');
var buildify = require('buildify');

var app = express();

var staticDevPath = path.join(__dirname, 'public');
var staticProPath = path.join(__dirname, 'public_dist');


//TODO: Copy images

if (app.get('env') === 'production') {
  app.use(express.static(staticProPath));
  app.use(favicon(staticProPath + '/images/favicon.ico'));

  buildify()
   .concat([ staticDevPath + '/libs/jquery/dist/jquery.min.js',
             staticDevPath + '/libs/angular/angular.js',
             staticDevPath + '/libs/angular-route/angular-route.js',
             staticDevPath + '/javascripts/angular/routes.js',
             staticDevPath + '/javascripts/angular/controllers.js',
             staticDevPath + '/javascripts/angular/app.js',
             staticDevPath + '/javascripts/main.js',
             staticDevPath + '/javascripts/pages/dashboard.js',
             staticDevPath + '/javascripts/pages/build-status.js',
             staticDevPath + '/javascripts/pages/projects.js',
             staticDevPath + '/javascripts/pages/releases.js',
             staticDevPath + '/javascripts/pages/environments.js'])
   .save(staticDevPath + '/javascripts/script.js')
   .uglify()
   .save(staticProPath + '/javascripts/script.js');

   fsExtra.copy(staticDevPath + '/stylesheets/style.css', staticProPath + '/stylesheets/style.css', { replace: true }, function(err) {
     if (err) {
       throw err;
     }
   });

 } else {
   app.use(express.static(staticDevPath));
   app.use(favicon(staticDevPath + '/images/favicon.ico'));
 }




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compass({ mode: 'compress' }));




// var uglyJs = uglifyJs.minify([ staticDevPath + '/libs/jquery/dist/jquery.min.js',
//                                staticDevPath + '/libs/angular/angular.js',
//                                staticDevPath + '/libs/angular-route/angular-route.js',
//                                staticDevPath + '/javascripts/angular/routes.js',
//                                staticDevPath + '/javascripts/angular/controllers.js',
//                                staticDevPath + '/javascripts/angular/app.js',
//                                staticDevPath + '/javascripts/main.js',
//                                staticDevPath + '/javascripts/pages/dashboard.js',
//                                staticDevPath + '/javascripts/pages/build-status.js',
//                                staticDevPath + '/javascripts/pages/projects.js',
//                                staticDevPath + '/javascripts/pages/releases.js',
//                                staticDevPath + '/javascripts/pages/environments.js'], {
//                                  outSourceMap: '/javascripts/script.min.js.map'
//                                });
//
// fs.writeFile(staticProPath + '/javascripts/script.min.js', uglyJs.code, function(err) {
//   if(err) {
//     console.log(err);
//   }
// });
//
// fs.writeFile(staticProPath + '/javascripts/script.min.js.map', uglyJs.map, function(err) {
//   if(err) {
//     console.log(err);
//   }
// });




function initControllers(com) {
  var indexController = require('./controllers/index');
  var apiController = require('./controllers/api')(com);

  app.use('/api', apiController);
  app.use('/', indexController);
}

module.exports = { app: app, initControllers: initControllers };
