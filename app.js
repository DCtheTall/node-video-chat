const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

// Dev middleware

app.use(morgan('dev'));

// App middleware

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '5mb' }));

// Views
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views/`);

app.get('/', (req, res) => res.render('index'));

module.exports = app;
