const { createServer } = require('http');
const ecstatic = require('ecstatic');
const IO = require('socket.io');
// const { Server: p2pServer } = require('socket.io-p2p-server');
const adapter = require('socket.io-redis');
const Promise = require('bluebird');

const server = createServer(ecstatic({
  root: __dirname,
  handleError: false,
  cache: 1,
}));
const io = IO(server);

io.adapter(adapter({
  host: 'localhost',
  port: 6379,
}));
// io.use(p2pServer);

io.on('connection', (socket) => {
  socket.on('join-or-create-room', async (room) => {
    const ioAdapter = io.of('/').adapter;
    await Promise.promisify(ioAdapter.remoteJoin, { context: ioAdapter })(socket.id, room);
    io.to(room).emit('joined-room', {
      room,
      client: socket.id,
    });
  });

  socket.on('leave-room', async (room) => {
    const ioAdapter = io.of('/').adapter;
    await Promise.promisify(ioAdapter.remoteLeave, { context: ioAdapter })(socket.id, room);
    io.to(room).emit('left-room', {
      client: socket.id,
    });
  });
});

server.listen(4000, () => console.log('Listening on 4000'));
