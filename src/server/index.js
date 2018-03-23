import { createServer } from 'http';
import io from 'socket.io';
import adapter from 'socket.io-redis';
import { authorize } from 'socketio-jwt';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import app from './app';
import schema from './schema';

const server = createServer(app);

app.io = io(server);
app.io.adapter(adapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));
app.io.use(authorize({
  handshake: true,
  secret: process.env.JWT_SECRET,
}));

app.io.on('connection', (socket) => {
  console.log(`socket connected to user ${socket.decoded_token.id}`);
  socket.on('disconnect', () => console.log(`socket disconnected from user ${socket.decoded_token.id}`));
});

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
  },
  {
    server: websocketServer,
    path: '/',
  },
))();

export default server;
