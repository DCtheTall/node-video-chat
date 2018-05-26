import {
  CALL_ACCEPTED,
  CALL_CANCELED,
  CALL_IGNORED,
  CALL_REQUEST,
  DISCONNECT,
} from '../../../constants';
import handleCallAccepted from './call-accepted';
import handleCallCanceled from './call-canceled';
import handleCallIgnored from './call-ignored';
import handleCallRequest from './call-request';
import handleDisconnect from './disconnect';

const handlers = {
  [CALL_ACCEPTED]: handleCallAccepted,
  [CALL_CANCELED]: handleCallCanceled,
  [CALL_IGNORED]: handleCallIgnored,
  [CALL_REQUEST]: handleCallRequest,
  [DISCONNECT]: handleDisconnect,
};

export default (io, socket) =>
  Object.keys(handlers).forEach(event =>
    socket.on(event, handlers[event].bind(null, io, socket)));
