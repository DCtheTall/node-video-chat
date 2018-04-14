let getSocket;

try {
  // condtional import only will get socket.io-client instance
  // when the window is defined
  if (window) getSocket = import('./client');
} catch (err) {
  console.log('server side rendering does not allow socket.io-client');
}

export default (getSocket || null);
