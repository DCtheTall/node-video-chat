import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import { connect } from 'react-redux';
import CALLING_CONTACT_QUERY from '../../graphql/queries/contacts/calling-contact.graphql';
import Loader from '../Layout/Loader';
import '../../styles/video-chat-calling.scss';

/**
 * @class Calling
 * @extends {React.PureComponent}
 */
class Calling extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="full-width full-height flex-center flex-column video-chat-calling">
        {this.props.callingContact.loading ? (
          <Loader />
        ) : (
          <div className="calling-contact flex-column align-items-center">
            <img
              alt={this.props.callingContact.data.user.username}
              src={this.props.callingContact.data.user.pictureUrl}
            />
            <div className="calling">
              Calling {this.props.callingContact.data.user.username}...
            </div>
            <button className="webchat-button">
              CANCEL
            </button>
          </div>
        )}
      </div>
    );
  }
}

Calling.propTypes = {
  callingContact: PropTypes.shape({
    loading: PropTypes.bool,
    data: PropTypes.shape({
      user: PropTypes.shape({
        username: PropTypes.string,
        pictureUrl: PropTypes.string,
      }),
    }),
  }),
};

export default compose(
  connect(
    state => ({ callingContactId: state.call.callingContactId }),
  ),
  graphql(
    CALLING_CONTACT_QUERY,
    {
      name: 'callingContact',
      options: props => ({
        variables: { contactId: props.callingContactId },
      }),
    },
  ),
)(Calling);
