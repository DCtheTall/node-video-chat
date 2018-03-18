import io from 'socket.io-client';

/**
 * @param {Object} store Redux store
 * @returns {Object} socket.io instance
 */
function connectSocket(store) {
  let { token } = store.getState();
  let socket = io.connect(process.env.APP_URL, {
    query: `token=${token}`,
  });

  store.subscribe(() => {
    const { token: newToken } = store.getState();
    if (newToken === token) return;
    if (!newToken) {
      if (socket) socket.disconnect();
      socket = null;
    }
    if (newToken) {
      if (socket) socket.disconnect();
      socket = io.connect(process.env.APP_URL, {
        query: `token=${newToken}`,
      });
    }
    token = newToken;
  });

  return socket;
}

export default connectSocket;
