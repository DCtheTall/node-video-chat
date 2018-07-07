import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import compression from 'compression';
import cors from 'cors';
import models from './models';
import deserealizeUser from './lib/deserealize-user';

// globals
global.models = models;

const app = express();

app.enable('trust proxy');

// Dev middleware

app.use(morgan('dev'));

// App middleware

app.use(cors({ credentials: true }));

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '5mb' }));

app.use(compression());

app.use(express.static(path.join('.', '/public')));

// Views
app.set('view engine', 'pug');
app.set('views', path.join('.', '/views/'));

app.use(deserealizeUser);

export default app;
