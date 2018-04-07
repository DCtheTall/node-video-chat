import { addError } from './error';

/**
 * @returns {function} redux thunk
 */
export function handleSocketDisconnect() {
  return function innerHandleSocketDisconnect(dispatch, getState) {
    if (getState().token) {
      dispatch(addError('Connection interrupted. Please refresh the page.'));
    }
  };
}
