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

app.use('/graphql', async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
  if (!token) return next();
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await models.user.findById(decoded.id);
  req.user = user;
  return next();
});
app.post('/graphql', graphqlExpress({ schema, graphiql: false }));

app.use(render);


module.exports = app;
