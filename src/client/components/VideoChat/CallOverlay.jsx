import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CallStatuses } from '../../actions/call';
import Loader from '../Layout/Loader';
import '../../styles/video-chat-call-overlay.scss';

/**
 * @class AcceptingCall
 * @extends {React.PureComponent}
 */
class CallOverlay extends React.PureComponent {
  /**
   * @returns {string} message for user
   */
  getMessage() {
    switch (this.props.status) {
      case CallStatuses.AcceptingCall:
        return 'Establishing connection...';
      case CallStatuses.HangingUp:
      default:
        return 'Ending call...';
    }
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="flex-center flex-column video-chat-call-overlay">
        <Loader />
        <div className="call-message">
          {this.getMessage()}
        </div>
      </div>
    );
  }
}

CallOverlay.propTypes = {
  status: PropTypes.shape(),
};

const mapStateToProps = state => ({
  status: state.call.status,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CallOverlay);
