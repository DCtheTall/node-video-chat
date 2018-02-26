const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const render = require('./routes/render');
const path = require('path');
const schema = require('./schema');
const graphqlExpress = require('express-graphql');
const models = require('./models');
const passport = require('../../config/passport')(models);
const session = require('express-session');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const api = require('./routes/api');

const app = express();

// Dev middleware

app.use(morgan('dev'));

// App middleware

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '5mb' }));

app.use(compression());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  maxAge: 86400000,
  cookie: { secure: false },
}));
app.use(passport.initialize());
app.use(passport.session());

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

// GraphQL
app.use('/api', api);
app.post('/graphql', (req, res, next) => { console.log(req.user); graphqlExpress({ schema, graphiql: false })(req,res,next) });
app.use(render);


module.exports = app;
