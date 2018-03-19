import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import graphqlExpress from 'express-graphql';
import path from 'path';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import Cookies from 'cookies';
import render from './routes/render';
import schema from './schema';
import models from './models';
import userIncludeConfig from './lib/user/include-config';

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

// Set req.cookies
app.use((req, res, next) => {
  req.cookies = new Cookies(req, res, { keys: [new Buffer(process.env.COOKIE_SECRET, 'utf-8')] });
  next();
});

// Deserializes the user session if there is one
app.use(async (req, res, next) => {
  try {
    const token = req.cookies.get(process.env.COOKIE_KEY, { signed: true }) || '';
    if (!token) return next();
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.user.findById(id, {
      order: [
        [{ model: models.contact_request, as: 'contactRequestsReceived' }, 'createdAt', 'DESC'],
      ],
      include: userIncludeConfig,
    });
    req.user = user;
  } catch (err) {
    console.log(err);
  }
  return next();
});

app.post('/graphql', graphqlExpress({ schema, graphiql: false }));

app.use(render);

export default app;
