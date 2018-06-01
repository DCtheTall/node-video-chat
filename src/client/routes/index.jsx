import React from 'react';
import { Redirect } from 'react-router';
import {
  INDEX_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  CONTACTS_ROUTE,
  MESSAGES_ROUTE,
  CONTACT_REQUESTS_ROUTE,
  SETTINGS_ROUTE,
} from '../constants';
import PageLayout from '../containers/PageLayout';
import Login from '../containers/Login';
import Signup from '../containers/Signup';
import Contacts from '../containers/Contacts';
import Messages from '../containers/Messages';
import ContactRequests from '../containers/ContactRequests';
import Settings from '../containers/Settings';

export default [{
  component: PageLayout,
  routes: [
    { path: INDEX_ROUTE, exact: true, component: () => <Redirect to={CONTACTS_ROUTE} /> },
    { path: LOGIN_ROUTE, component: Login },
    { path: SIGNUP_ROUTE, component: Signup },
    { path: CONTACTS_ROUTE, component: Contacts },
    { path: MESSAGES_ROUTE, component: Messages },
    { path: CONTACT_REQUESTS_ROUTE, component: ContactRequests },
    { path: SETTINGS_ROUTE, component: Settings },
  ],
}];
