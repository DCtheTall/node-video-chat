import {
  CALL_REQUEST,
  DISCONNECT,
} from '../../../constants';
import handleCallRequest from './call-request';
import handleDisconnect from './disconnect';

const handlers = {
  [CALL_REQUEST]: handleCallRequest,
  [DISCONNECT]: handleDisconnect,
};

export default socket =>
  Object.keys(handlers).forEach(event =>
    socket.on(event, handlers[event]));
