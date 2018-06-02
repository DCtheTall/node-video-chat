import { createServer } from 'http';
import app from './app';
import initIO from './io';

const server = createServer(app);
app.io = initIO(server);

export default server;
