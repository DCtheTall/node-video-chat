import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import QUERY_USER_ID from '../graphql/queries/user/id.graphql';
import LOGIN_MUTATION from '../graphql/mutations/user/login.graphql';
import { INDEX_ROUTE, SIGNUP_ROUTE } from '../constants';
import { isLoggedIn } from '../helpers/auth-helpers';
import { addError, clearError } from '../actions/error';
import Loader from '../components/Layout/Loader';
import '../styles/login.scss';

/**
 * @class Login
 * @extends {React.PureComponent}
 */
class Login extends React.PureComponent {
  /**
   * @constructor
   * @constructs Login
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
    };
    this.isLoading = this.isLoading.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  /**
   * @returns {undefined}
   */
  componentDidMount() {
    if (isLoggedIn(this.props.data.user)) {
      this.context.router.history.replace(INDEX_ROUTE);
    }
  }
  /**
   * @returns {undefined}
   */
  componentDidUpdate() {
    if (isLoggedIn(this.props.data.user)) {
      this.context.router.history.push(INDEX_ROUTE);
    }
  }
  /**
   * @returns {boolean} if the component is requesting data from the server
   */
  isLoading() {
    return this.props.data.loading || this.state.loading;
  }
  /**
   * @param {Object} event the change event
   * @returns {undefined}
   */
  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }
  /**
   * @param {string} error message
   * @returns {undefined}
   */
  async handleError(error = 'Something went wrong logging you in') {
    await new Promise(resolve => this.setState({ loading: false }, resolve));
    return this.props.addError(error);
  }
  /**
   * @returns {undefined}
   */
  async handleSubmit() {
    this.props.clearError();
    await new Promise(resolve => this.setState({ loading: true }, resolve));
    try {
      const { data } = await this.props.loginUser({
        variables: { email: this.state.email.trim(), password: this.state.password },
      });
      if (!data.result) return this.handleError();
      const { success, message } = data.result;
      if (!success) return this.handleError(message);
      await new Promise(resolve => this.setState({ loading: false }, resolve));
      return this.props.client.resetStore();
    } catch (err) {
      console.log(err);
      return this.handleError();
    }
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="login-container flex-center">
        <div className="login flex-column align-items-center">
          <span className="webchat-text login-heading">
            Welcome back!
          </span>
          <span className="sub-heading text-center">
            Don&apos;t have an account?
            <br />
            <Link className="webchat-text" to={SIGNUP_ROUTE}>
              Create one here
            </Link>
          </span>
          {this.isLoading() ? (
            <Loader />
          ) : (
            <div className="flex-column align-items-center">
              <input
                placeholder="Email or Username"
                type="text"
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
              <input
                placeholder="Password"
                type="password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
              />
              <button className="webchat-button" onClick={this.handleSubmit}>
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.shape(),
};

Login.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    user: PropTypes.shape(),
    refetch: PropTypes.func,
  }),
  client: PropTypes.shape({
    resetStore: PropTypes.func,
  }),
  loginUser: PropTypes.func,
  addError: PropTypes.func,
  clearError: PropTypes.func,
};

export default compose(
  withApollo,
  connect(null, { addError, clearError }),
  graphql(LOGIN_MUTATION, { name: 'loginUser' }),
  graphql(QUERY_USER_ID),
)(Login);
