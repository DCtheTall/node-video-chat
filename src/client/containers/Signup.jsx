import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isEmail } from 'validator';
import { graphql, withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';
import { INDEX_ROUTE, LOGIN_ROUTE } from '../constants';
import SIGNUP_MUTATION from '../graphql/mutations/user/signup.graphql';
import QUERY_USER_ID from '../graphql/queries/user/id.graphql';
import isLoggedIn from '../helpers/is-logged-in';
import { addError, clearError } from '../actions/error';
import { setToken } from '../actions/token';
import Loader from '../components/Layout/Loader';
import '../styles/signup.scss';

/**
 * @class Signup
 * @extends {React.PureComponent}
 */
class Signup extends React.PureComponent {
  /**
   * @constructor
   * @constructs Signup
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    };
    this.handleChange = this.handleChange.bind(this);
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
    const val = name === 'username' ? value.slice(0, 16) : value;
    this.setState({ [name]: val });
  }
  /**
   * @param {string} error message
   * @returns {undefined}
   */
  async handleError(error = 'Something went wrong signing you up') {
    await new Promise(resolve => this.setState({ loading: false }, resolve));
    return this.props.addError(error);
  }
  /**
   * @returns {Promise<undefined>} attempts to register new user
   */
  async handleSubmit() {
    this.props.clearError();
    switch (true) {
      case (!this.state.email):
        this.emailInput.focus();
        return this.props.addError('You must provide an email address');

      case (!isEmail(this.state.email)):
        this.emailInput.focus();
        return this.props.addError('You must provide a valid email address');

      case (!this.state.username):
        this.usernameInput.focus();
        return this.props.addError('You must provide a username');

      case (!this.state.password):
        this.passwordInput.focus();
        return this.props.addError('You must provide a password');

      case (this.state.password !== this.state.confirmPassword):
        this.confirmPasswordInput.focus();
        return this.props.addError('The password must match the confirmation');


      default:
        break;
    }

    try {
      await new Promise(resolve => this.setState({ loading: true }, resolve));
      const { data } = await this.props.signupUser({
        variables: {
          email: this.state.email.trim(),
          username: this.state.username.trim(),
          password: this.state.password,
        },
      });
      if (!data.result) return this.handleError();
      const { success, message, token } = data.result;
      if (!success) return this.handleError(message);
      this.props.setToken(token);
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
      <div className="signup-container flex-center">
        <div className="signup flex-column align-items-center">
          <span className="webchat-text signup-heading">
            Hey there!
          </span>
          <span className="sub-heading text-center">
            Create your account below
            <br />
            Already have an account?
            <br />
            <Link className="webchat-text" to={LOGIN_ROUTE}>
              Sign in here
            </Link>
          </span>
          {this.isLoading() ? (
            <Loader />
          ) : (
            <div className="flex-column align-items-center">
              <input
                ref={node => this.emailInput = node}
                placeholder="Email"
                type="text"
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
              <input
                ref={node => this.usernameInput = node}
                placeholder="Username"
                type="text"
                name="username"
                onChange={this.handleChange}
                value={this.state.username}
              />
              <input
                ref={node => this.passwordInput = node}
                placeholder="Password"
                type="password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
              />
              <input
                ref={node => this.confirmPasswordInput = node}
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                onChange={this.handleChange}
                value={this.state.confirmPassword}
              />
              <button className="webchat-button" onClick={this.handleSubmit}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Signup.contextTypes = {
  router: PropTypes.shape(),
};

Signup.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    user: PropTypes.shape(),
    refetch: PropTypes.func,
  }),
  client: PropTypes.shape({
    resetStore: PropTypes.func,
  }),
  addError: PropTypes.func,
  clearError: PropTypes.func,
  signupUser: PropTypes.func,
  setToken: PropTypes.func,
};

export default compose(
  withApollo,
  connect(null, { addError, clearError, setToken }),
  graphql(QUERY_USER_ID),
  graphql(SIGNUP_MUTATION, { name: 'signupUser' }),
)(Signup);
