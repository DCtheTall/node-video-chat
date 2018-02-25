import PageLayout from '../containers/PageLayout';
import Login from '../containers/Login';
import Signup from '../containers/Signup';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from './constants';

const routes = [{
  component: PageLayout,
  routes: [
    { path: LOGIN_ROUTE, component: Login },
    { path: SIGNUP_ROUTE, component: Signup },
  ],
}];

export default routes;
