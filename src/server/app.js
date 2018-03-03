const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const render = require('./routes/render');
const path = require('path');
const schema = require('./schema');
const graphqlExpress = require('express-graphql');
const models = require('./models');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

const app = express();

// Dev middleware

app.use(morgan('dev'));

// App middleware

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '5mb' }));

app.use(compression());

app.use(express.static(path.join('.', '/public')));

// Views
app.set('view engine', 'pug');
app.set('views', path.join('.', '/views/'));

// globals
global.models = models;
global.successResponse =
  (json = {}, message = 'Success!') =>
    res => res.set(200).json({ success: true, message, ...json });
global.failureResponse =
  (json = {}, message = 'Something went wrong...') =>
    res => res.set(400).json({ succes: false, message, ...json });
global.errorResponse =
  (err, message = 'Internal server error') =>
    res => res.set(500).json({ success: false, message });

app.use((req, res, next) => {
  req.cookies = new Cookies(req, res, { keys: [new Buffer(process.env.COOKIE_SECRET, 'utf-8')] });
  next();
});
app.use(async (req, res, next) => {
  try {
    const token = req.cookies.get(process.env.COOKIE_KEY, { signed: true }) || '';
    if (!token) return next();
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.user.findById(decoded.id);
    req.user = user;
  } catch (err) {
    console.log(err);
  }
  return next();
});

app.post('/graphql', graphqlExpress({ schema, graphiql: false }));

app.use(render);

module.exports = app;
