import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import app from './app';
import schema from './schema';
import initIO from './io';

const server = createServer(app);

app.io = initIO(server);

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

export default server;
