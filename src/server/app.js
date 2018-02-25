const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const render = require('./render');
const path = require('path');
const schema = require('./schema');
const graphqlMiddleware = require('express-graphql');
const models = require('./models');

const app = express();

// Dev middleware

app.use(morgan('dev'));

// App middleware

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '5mb' }));

app.use(express.static(path.join('.', '/public')));

// Views
app.set('view engine', 'pug');
app.set('views', path.join('.', '/views/'));

// GraphQL
app.use('/graphql', graphqlMiddleware(
  req => ({ schema, graphiql: false, rootValue: { req } })
));

// Models
global.models = models;

app.use(render);

module.exports = app;
