import PageLayout from '../containers/PageLayout';
import Login from '../containers/Login';
import Signup from '../containers/Signup';

const routes = [{
  component: PageLayout,
  routes: [
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
  ],
}];

export default routes;
