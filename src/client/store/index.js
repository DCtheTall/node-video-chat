import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import reducers from '../reducers';

export default (initialState = {}) => createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(thunk)),
);
