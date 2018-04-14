let getSocket;

try {
  if (window) getSocket = import('./connect');
} catch (err) {
  console.log('server side rendering does not allow socket.io-client');
}

export default (getSocket || (() => null));
