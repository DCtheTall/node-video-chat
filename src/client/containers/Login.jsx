import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
// import { connect } from 'react-redux';
import QUERY_USER_ID from '../graphql/queries/user/id.graphql';
import LOGIN_MUTATION from '../graphql/mutations/user/login.graphql';
import { INDEX_ROUTE } from '../constants';
import { isLoggedIn } from '../helpers/auth-helpers';
// import { login } from '../actions/user';

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
      email: '',
      password: '',
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
   * @param {Object} event the change event
   * @returns {undefined}
   */
  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }
  /**
   * @returns {undefined}
   */
  async handleSubmit() {
    await this.props.loginUser({
      variables: {
        loginInput: { email: this.state.email, password: this.state.password },
      },
    });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div>
        Log in:
        <input
          placeholder="Email"
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
        <button onClick={this.handleSubmit}>
          Submit
        </button>
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
    user: PropTypes.shape({ isLoggedIn: PropTypes.bool }),
    refetch: PropTypes.func,
  }),
  loginUser: PropTypes.func,
};

export default graphql(LOGIN_MUTATION, { name: 'loginUser' })(graphql(QUERY_USER_ID)(Login));
