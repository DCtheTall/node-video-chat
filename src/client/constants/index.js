export const LOGIN_ROUTE = '/login';
export const SIGNUP_ROUTE = '/signup';

export const INDEX_ROUTE = '/';

export const CONTACT_REQUESTS_ROUTE = '/contact-requests';
export const CONTACTS_ROUTE = '/contacts';
export const MESSAGES_ROUTE = '/messages';

export const MESSAGE_THREAD_ROUTE = '/messages/thread/:id';
export const GET_MESSAGE_THREAD_ROUTE = id => MESSAGE_THREAD_ROUTE.replace(':id', id);

export const RESET_REDUX_STORE = 'RESET_REDUX_STORE';

export * from './socket-events';
