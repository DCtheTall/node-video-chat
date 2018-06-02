import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import graphqlExpress from 'express-graphql';
import path from 'path';
import compression from 'compression';
import render from './routes/render';
import schema from './schema';
import models from './models';
import deserealizeUser from './lib/deserealize-user';
import getUserStatus from './routes/get-user-status';
import getUserSocketId from './routes/get-user-socketid';

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

app.use(deserealizeUser);

app.post('/graphql', graphqlExpress({ schema, graphiql: false }));
app.get('/user/:userid/status', getUserStatus);
app.get('/user/:userid/socket-id', getUserSocketId);

app.use(render);

export default app;
