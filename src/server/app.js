import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import graphqlExpress from 'express-graphql';
import path from 'path';
import compression from 'compression';
import render from './routes/render';
import schema from './schema';
import models from './models';
import deserealizeUser from './lib/user/deserealize';

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

app.use(deserealizeUser);

app.post('/graphql', graphqlExpress({ schema, graphiql: false }));

app.use(render);

export default app;
