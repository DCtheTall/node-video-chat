import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import CURRENT_USER_ID_QUERY from '../queries/current-user/current-user-id.graphql';
import { INDEX_ROUTE } from '../routes/constants';
import { isLoggedIn } from '../helpers/auth-helpers';

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
   * @param {Object} event the change event
   * @returns {undefined}
   */
  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
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
        <button>
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
    user: PropTypes.shape(),
  }),
};

export default graphql(CURRENT_USER_ID_QUERY)(Login);
