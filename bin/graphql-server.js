import graphqlExpress from 'express-graphql';
import debug from 'debug';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

module.exports = function startServer() {
  /* eslint-disable global-require */
  if (!process.env.NODE_ENV) require('dotenv').load();

  const app = require('../src/server/app').default;
  const schema = require('../src/server/schema').default;
  const render = require('../src/server/routes/render').default;

  app.post('/graphql', graphqlExpress({ schema, graphiql: false }));
  app.use(render);

  const server = createServer(app);

  /**
   * onListen callback for server
   * @returns {undefined}
   */
  function onListen() {
    console.log(`Listening on port ${process.env.PORT}`);
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }

  /**
   * onError callback
   * @param {Error} err the error
   * @returns {undefined}
   */
  function onError(err) {
    if (err.syscall !== 'listen') throw err;

    const bind = typeof port === 'string' ? `Pipe ${process.env.PORT}` : `Port ${process.env.PORT}`;

    switch (err.code) {
      case 'EACCESS':
        console.log(`${bind} requires elevated privilege`);
        break;
      case 'EADDRINUSE':
        console.log(`${bind} is already in use`);
        break;
      default:
        throw err;
    }
  }

  server.on('listening', onListen);
  server.on('error', onError);
  server.listen(process.env.PORT, () => new SubscriptionServer(
    {
      keepAlive: 1000,
      schema,
      execute,
      subscribe,
      onConnect: () => ({ app }),
    },
    {
      server,
      path: '/subscriptions',
    },
  ));
};
