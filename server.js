const { createServer } = require('http');
const ecstatic = require('ecstatic');
const IO = require('socket.io');
const adapter = require('socket.io-redis');
const Promise = require('bluebird');

const server = createServer(ecstatic({
  root: __dirname,
  handleError: false,
  cache: 1,
}));
const io = IO(server);

function getSocketById(io, id) {
  const { connected } = io.sockets.clients();
  const connectedSockets = Object.keys(connected).map(key => connected[key]);
  return connectedSockets.find(so => so.id === id);
}

io.adapter(adapter({
  host: 'localhost',
  port: 6379,
}));

io.on('connection', (socket) => {
  socket.on('call:request', ({ toId }) => {
    console.log(`Call request from ${socket.id} to call ${toId}`);
    const toSocket = getSocketById(io, toId);
    if (!toSocket) socket.emit('call:unavailable', { toId });
    toSocket.emit('call:received', { fromId: socket.id });
  });
  socket.on('call:canceled', ({ toId }) => {
    console.log(`Call from ${socket.id} to ${toId} canceled by caller`);
    const toSocket = getSocketById(io, toId);
    return toSocket && toSocket.emit('call:canceled', { fromId: socket.id });
  });
  socket.on('call:ignored', ({ fromId }) => {
    console.log(`Call from ${fromId} ignored by ${socket.id}`);
    const fromSocket = getSocketById(io, fromId);
    if (!fromSocket) return;
    fromSocket.emit('call:unavailable', { toId: socket.id });
  });
  socket.on('call:accepted', ({ fromId }) => {
    console.log(`Call from ${fromId} to ${socket.id} accepted. Establishing peer connection`);
    const fromSocket = getSocketById(io, fromId);
    if (!fromSocket) return socket.emit('call:canceled', { fromId });
    fromSocket.emit('call:accepted', { toId: socket.id });
  });
});

server.listen(4000, () => console.log('Listening on 4000'));
