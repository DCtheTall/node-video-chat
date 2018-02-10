"use strict";

require('dotenv').load();

var server = require('../app')
  , debug = require('debug')
  , port = normalizePort(process.env.PORT || 3000);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
}

function onError(error) {
  if(error.syscall !== 'listen') throw error;

  var bind = typeof port === 'string'? 'Pipe ' + port : "Port " + port;

  switch(error.code) {
    case "EACCES":
      console.error(bind + " requires elevated priviledges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  console.log('Server listening on port: '+ port);
  var addr = server.address()
    , bind = typeof addr === 'string'? 'pipe ' + addr : 'port ' + addr.port;
  debug("Listening on " + bind);
}
