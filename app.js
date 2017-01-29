"use strict";

let express = require('express')
  , app = express()
  , router = require('./routes')
  , path = require('path')
  , fs = require('fs')
  , http = require('http')
  , bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(router);

let server = http.createServer();

global.apiSuccessWrapper = (json, message) => Object.assign({}, json, { message, sucess: true });
global.apiFailureWrapper = (json, message) => Object.assign({}, json, { message, sucess: false });

module.exports = server;
