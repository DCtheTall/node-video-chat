const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const render = require('./routes/render');
const path = require('path');
const schema = require('./schema');
const graphqlExpress = require('express-graphql');
const models = require('./models');
const compression = require('compression');
const jwt = require('express-jwt');

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

app.use('/graphql', jwt({
  secret: process.env.JWT_SECRET,
  requestProperty: 'auth',
  credentialsRequired: false,
}));
app.use('/graphql', (req, res, next) => {
  next();
});
app.post('/graphql', graphqlExpress({ schema, graphiql: false }));

app.use(render);


module.exports = app;
