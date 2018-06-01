import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isEmail } from 'validator';
import USER_SETTINGS_QUERY from '../graphql/queries/user/settings.graphql';
import UPDATE_USER_MUTATION from '../graphql/mutations/user/update.graphql';
import { clearError, addError } from '../actions/error';
import { addNotice } from '../actions/notice';
import Sidebar from './Layout/Sidebar';
import Headroom from '../components/Settings/Headroom';
import FormRow from '../components/Settings/FormRow';
import UploadPicture from '../components/Settings/UploadPicture';
import Loader from '../components/Layout/Loader';

/**
 * @class Settings
 * @extends {React.PureComponent}
 */
class Settings extends React.PureComponent {
  /**
   * @constructor
   * @constructs Settings
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = {
      loadingEmail: false,
      loadingUsername: false,
    };
    this.updateUserEmail = this.updateUserEmail.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
  }
  /**
   * @param {string} stateToUpdate key in state to update
   * @returns {undefined}
   */
  async handleError(stateToUpdate) {
    await new Promise(resolve => this.setState({ [stateToUpdate]: false }, resolve));
    return this.props.addError('Something went wrong updating your account.');
  }
  /**
   * @param {Object} payload for update mutation
   * @returns {undefined}
   */
  async updateUser({ newEmail = null, newUsername = null }) {
    const stateToUpdate = newEmail ? 'loadingEmail' : 'loadingUsername';
    this.props.clearError();
    await new Promise(res => this.setState({ [stateToUpdate]: true }, res));
    try {
      const { data } = await this.props.updateUser({
        variables: { newEmail, newUsername },
        refetchQueries: [{ query: USER_SETTINGS_QUERY }],
      });
      if (!data.result || !data.result.success) return this.handleError(stateToUpdate);
      await new Promise(res => this.setState({ [stateToUpdate]: false }, res));
      return this.props.addNotice('Succesfully updated your account.');
    } catch (err) {
      console.log(err);
      return this.handleError(stateToUpdate);
    }
  }
  /**
   * @param {string} newEmail for user's account
   * @returns {undefined}
   */
  updateUserEmail(newEmail) {
    if (!isEmail(newEmail)) return this.props.addError('You must provide a valid email address.');
    return this.updateUser({ newEmail });
  }
  /**
   * @param {string} newUsername for user's account
   * @returns {undefined}
   */
  updateUserName(newUsername) {
    this.updateUser({ newUsername });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <Sidebar>
        <div className="full-height flex-column">
          <Headroom />
          {this.props.userSettings.loading ? (
            <div className="flex-center">
              <Loader />
            </div>
          ) : (
            <div>
              <UploadPicture
                pictureUrl={this.props.userSettings.data.pictureUrl}
                username={this.props.userSettings.data.username}
              />
              <FormRow
                label="Your Username"
                loading={this.state.loadingUsername}
                value={this.props.userSettings.data.username}
                onSubmit={this.updateUserName}
              />
              <FormRow
                label="Your Email"
                loading={this.state.loadingEmail}
                value={this.props.userSettings.data.email}
                onSubmit={this.updateUserEmail}
              />
            </div>
          )}
        </div>
      </Sidebar>
    );
  }
}

Settings.propTypes = {
  clearError: PropTypes.func,
  addError: PropTypes.func,
  addNotice: PropTypes.func,
  updateUser: PropTypes.func,
  userSettings: PropTypes.shape({
    loading: PropTypes.bool,
    data: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      pictureUrl: PropTypes.string,
    }),
  }),
};

export default compose(
  connect(null, { clearError, addError, addNotice }),
  graphql(
    USER_SETTINGS_QUERY,
    { name: 'userSettings' }
  ),
  graphql(
    UPDATE_USER_MUTATION,
    { name: 'updateUser' },
  )
)(Settings);
