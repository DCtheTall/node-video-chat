import { MESSAGES_ROUTE, MESSAGE_THREAD_ROUTE } from '../constants/index';
import MessageThreadList from '../containers/Messages/MessageThreadList';
import OpenMessageThread from '../containers/Messages/OpenMessageThread';

export default [
  {
    path: MESSAGES_ROUTE,
    exact: true,
    component: MessageThreadList,
  },
  {
    path: MESSAGE_THREAD_ROUTE,
    component: OpenMessageThread,
  },
];
