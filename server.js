const { createServer } = require('http');
const ecstatic = require('ecstatic');
const socketIO = require('socket.io');
const { Server: p2pServer } = require('socket.io-p2p-server');

const server = createServer(ecstatic({
  root: __dirname,
  handleError: false,
  cache: 1,
}));
const io = socketIO(server);

io.use(p2pServer);
io.on('connection', (socket) => {
  socket.on('start-stream', (data) => {
    console.log('Stream started');
    socket.broadcast.emit('start-stream', data);
  });
});
server.listen(3000, () => console.log('Listening on 3000'));
