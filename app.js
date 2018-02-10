const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

// Dev middleware

app.use(morgan('dev'));

// App middleware

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '5mb' }));

module.exports = app;
