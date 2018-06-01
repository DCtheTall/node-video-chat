export const LOGIN_ROUTE = '/login';
export const SIGNUP_ROUTE = '/signup';

export const INDEX_ROUTE = '/';

export const CONTACT_REQUESTS_ROUTE = '/contact-requests';
export const CONTACTS_ROUTE = '/contacts';
export const MESSAGES_ROUTE = '/messages';
export const SETTINGS_ROUTE = '/settings';

export const MESSAGE_THREAD_ROUTE = '/messages/thread/:threadid';
export const GET_MESSAGE_THREAD_ROUTE = threadid => MESSAGE_THREAD_ROUTE.replace(':threadid', threadid);

export const RESET_REDUX_STORE = 'RESET_REDUX_STORE';

export * from '../../constants';
