const { createServer } = require('http');
const ecstatic = require('ecstatic');
const IO = require('socket.io');
const { Server: p2pServer } = require('socket.io-p2p-server');
const adapter = require('socket.io-redis');

const server = createServer(ecstatic({
  root: __dirname,
  handleError: false,
  cache: 1,
}));
const io = IO(server);

function getNumClientsInRoom(room) {
  return Object.keys(io.in(room).sockets).length;
}

io.adapter(adapter({
  host: 'localhost',
  port: 6379,
}));
io.use(p2pServer);
io.on('connection', (socket) => {
  socket.on('join-or-create', (room) => {
    socket.join(room);
    io.to(room).emit('joined-room', {
      room,
      clients: getNumClientsInRoom(room),
    });
  });
});
server.listen(4000, () => console.log('Listening on 4000'));
