import io from 'socket.io-client';

const socket = io.connect(process.env.APP_URL);

export default socket;
