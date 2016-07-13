/// <reference path="typings/node/node.d.ts"/>

var fs = require('fs');
var fsExtra = require('fs.extra');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sass = require('node-sass');
var compressor = require('node-minify');

var indexController = require('./controllers/index');
var apiController = require('./controllers/api');

var app = express();

var staticDevPath = path.join(__dirname, 'static');
var staticProPath = path.join(__dirname, 'static_dist');

app.use(express.static(staticDevPath));
app.use(favicon(staticDevPath + '/images/favicon.ico'));

var scripts = [staticDevPath + '/javascripts/vendor/jquery/dist/jquery.min.js',
               staticDevPath + '/javascripts/vendor/angular/angular.js',
               staticDevPath + '/javascripts/vendor/angular-route/angular-route.js',
               staticDevPath + '/javascripts/angular/routes.js',
               staticDevPath + '/javascripts/angular/controllers.js',
               staticDevPath + '/javascripts/angular/app.js',
               staticDevPath + '/javascripts/main.js',
               staticDevPath + '/javascripts/pages/dashboard.js',
               staticDevPath + '/javascripts/pages/build-status.js',
               staticDevPath + '/javascripts/pages/projects.js',
               staticDevPath + '/javascripts/pages/releases.js',
               staticDevPath + '/javascripts/pages/environments.js'];

if (app.get('env') === 'production') {
  new compressor.minify({
      type: 'uglifyjs',
      fileIn: scripts,
      fileOut: staticDevPath + '/javascripts/script.js',
      callback: function(err, min){
          // console.log(err);
      }
  });
}
else {
  new compressor.minify({
      type: 'no-compress',
      fileIn: scripts,
      fileOut: staticDevPath + '/javascripts/script.js',
      callback: function(err, min){
          // console.log(err);
      }
  });
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

sass.render({
  file: staticDevPath + '/stylesheets/style.scss',
  outFile: staticDevPath + '/stylesheets/style.css',
}, function(err, result) {
    if(!err){
        fs.writeFile(staticDevPath + '/stylesheets/style.css', result.css, function(err) {
          if(!err) {}
        });
      }
 });


app.use('/api', apiController);
app.use('/', indexController);

module.exports = app;
