import debug from 'debug';
import { createServer } from 'http';

module.exports = function startSignalServer() {
  /* eslint-disable global-require */
  if (!process.env.NODE_ENV) require('dotenv').load();

  const app = require('../src/server/app').default;
  const getUserStatus = require('../src/server/routes/get-user-status').default;
  const getUserSocketId = require('../src/server/routes/get-user-socketid').default;
  const initIO = require('../src/server/io').default;

  const server = createServer(app);
  app.io = initIO(server);

  app.get('/user/:userid/status', getUserStatus);
  app.get('/user/:userid/socket-id', getUserSocketId);

  /**
   * onListen callback for server
   * @returns {undefined}
   */
  function onListen() {
    console.log(`Listening on port ${process.env.PORT}`);
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

    const bind = typeof port === 'string' ? `Pipe ${process.env.PORT}` : `Port ${process.env.PORT}`;

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
  server.listen(process.env.PORT);
};
