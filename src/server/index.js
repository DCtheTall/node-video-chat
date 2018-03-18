import { createServer } from 'http';
import io from 'socket.io';
import { authorize } from 'socketio-jwt';
import app from './app';

const server = createServer(app);

app.io = io(server);

app.io.use(authorize({
  handshake: true,
  secret: process.env.JWT_SECRET,
}));

app.io.on('connection', (socket) => {
  console.log(`\n\n\n\n\nsocket connected to user ${socket.decoded_token.id}\n\n\n\n\n`);
  socket.on('disconnect', () => console.log('\n\n\n\n\n\nsocket disconnected\n\n\n\n\n'));
});

export default server;
