if (!process.env.NODE_ENV) require('dotenv').load(); // eslint-disable-line global-require

/* eslint-disable import/first */
import http from 'http';
import debug from 'debug';
import app from '../src/server/app';
import init from 'socket.io';

/**
 * normalizePort
 * @param {string|number} val the port number
 * @returns {number|boolean} normalized port
 */
function normalizePort(val) {
  let port = parseInt(val, 10);
  port = port >= 0 ? port : false;
  return isNaN(port) ? val : port;
}

const port = normalizePort(process.env.PORT || 4000);
const server = http.createServer(app);

app.io = init(server);

app.io.on('connection', () => {
  console.log('socket connected');
});

/**
 * onListen callback for server
 * @returns {undefined}
 */
function onListen() {
  console.log(`Listening on port ${port}`);
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

/**
 * onError callback
 * @param {Error} err the error
 * @returns {undefined}
 */
function onError(err) {
  if (err.syscall !== 'listen') throw err;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (err.code) {
    case 'EACCESS':
      console.log(`${bind} requires elevated privilege`);
      break;
    case 'EADDRINUSE':
      console.log(`${bind} is already in use`);
      break;
    default:
      throw err;
  }
}

server.on('listening', onListen);
server.on('error', onError);
server.listen(port);
