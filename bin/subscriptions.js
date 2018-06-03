module.exports = function startSubscriptionServer() { /* eslint-disable global-require */
  const { createServer } = require('http');
  const { execute, subscribe } = require('graphql');
  const { SubscriptionServer } = require('subscriptions-transport-ws');
  const app = require('../src/server/app').default;
  const schema = require('../src/server/schema').default;

  const websocketServer = createServer((req, res) => {
    res.writeHead(404);
    res.end();
  });

  websocketServer.listen(process.env.PORT);

  (() => new SubscriptionServer(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => ({ app }),
    },
    {
      server: websocketServer,
      path: '/',
    },
  ))();
};
