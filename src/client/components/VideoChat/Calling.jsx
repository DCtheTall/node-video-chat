import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from 'redux';
import { connect } from 'react-redux';
import CALLING_CONTACT_QUERY from '../../graphql/queries/contacts/calling-contact.graphql';
import {
  cancelCall,
  CallStatuses,
  setCallStatusToAvailable,
  setCallingContactId,
} from '../../actions/call';
import Loader from '../Layout/Loader';
import '../../styles/video-chat-calling.scss';

/**
 * @class Calling
 * @extends {React.PureComponent}
 */
class Calling extends React.PureComponent {
  /**
   * @constructor
   * @constructs Calling
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.cancelCall = this.cancelCall.bind(this);
  }
  /**
   * @param {Object} props component will receive
   * @returns {undefined}
   */
  componentWillReceiveProps(props) {
    if (props.status === CallStatuses.CallFailed) {
      setTimeout(() => {
        this.props.setCallStatusToAvailable();
        this.props.setCallingContactId(null);
      }, 1e4);
    }
  }
  /**
   * @returns {undefined}
   */
  cancelCall() {
    this.props.cancelCall();
  }
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
            <div className="call-message">
              {this.props.status === CallStatuses.Calling ?
                `Calling ${this.props.callingContact.data.user.username}...`
                : `Unable to reach ${this.props.callingContact.data.user.username}.`
              }
            </div>
            {this.props.status === CallStatuses.Calling && (
              <button
                className="hangup-button"
                onClick={this.cancelCall}
              >
                CANCEL
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

Calling.propTypes = {
  status: PropTypes.shape(),
  cancelCall: PropTypes.func,
  setCallingContactId: PropTypes.func,
  setCallStatusToAvailable: PropTypes.func,
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
    state => ({
      callingContactId: state.call.callingContactId,
      status: state.call.status,
    }),
    {
      cancelCall,
      setCallStatusToAvailable,
      setCallingContactId,
    },
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
