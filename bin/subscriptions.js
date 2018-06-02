if (!process.env.NODE_ENV) require('dotenv').load(); // eslint-disable-line global-require

const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const app = require('../src/server/app').default;
const schema = require('../src/server/schema').default;

const websocketServer = createServer((req, res) => {
  res.writeHead(404);
  res.end();
});

websocketServer.listen(process.env.GRAPHQL_WS_PORT);

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
