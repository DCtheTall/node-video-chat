const { createServer } = require('http').default;
const { execute, subscribe } = require('graphql').default;
const { SubscriptionServer } = require('subscriptions-transport-ws').default;
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
