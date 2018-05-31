import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  CallStatuses,
  setCallStatusToAvailable,
  toggleVideoTrack,
  toggleAudioTrack,
} from '../../actions/call';
import TrackToggle from './Controller/TrackToggle';
import '../../styles/video-chat-controller.scss';

/**
 * @class Controller
 * @extends {React.PureComponent}
 */
class Controller extends React.PureComponent {
  /**
   * @constructor
   * @constructs Controller
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { showHangupMessage: false };
    this.onHangupClick = this.onHangupClick.bind(this);
    this.showHangupMessage = this.showHangupMessage.bind(this);
    this.hideHangupMessage = this.hideHangupMessage.bind(this);
    this.toggleAudioTrack = this.toggleAudioTrack.bind(this);
    this.toggleVideoTrack = this.toggleVideoTrack.bind(this);
  }
  /**
   * @returns {undefined}
   */
  onHangupClick() {
    if (this.props.status === CallStatuses.Testing) {
      return this.props.setCallStatusToAvailable();
    }
    return this.props.startHangup();
  }
  /**
   * @returns {string} message when someone hovers the hangup button
   */
  getHangupMessage() {
    switch (this.props.status) {
      case CallStatuses.Testing:
        return 'End video test';
      default:
        return 'Hang up';
    }
  }
  /**
   * @returns {undefined}
   */
  showHangupMessage() {
    this.setState({ showHangupMessage: true });
  }
  /**
   * @returns {undefined}
   */
  hideHangupMessage() {
    this.setState({ showHangupMessage: false });
  }
  /**
   * @returns {undefined}
   */
  toggleAudioTrack() {
    this.props.toggleAudioTrack();
  }
  /**
   * @returns {undefined}
   */
  toggleVideoTrack() {
    this.props.toggleVideoTrack();
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="video-chat-bottom-banner">
        <div className="display-flex track-toggle-container">
          <TrackToggle
            iconName="video-camera"
            onPress={this.toggleVideoTrack}
            trackEnabled={this.props.videoEnabled}
            track="video"
          />
          <TrackToggle
            iconName="microphone"
            onPress={this.toggleAudioTrack}
            trackEnabled={this.props.audioEnabled}
            track="audio"
          />
        </div>
        <div className="hangup-button-container">
          <button
            className="hangup-button"
            onClick={this.onHangupClick}
            onMouseEnter={this.showHangupMessage}
            onMouseLeave={this.hideHangupMessage}
          >
            <svg width="70" height="70" viewBox="0 0 70 70">
              <path
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                d="M 29 27 L 45 43"
              />
              <path
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                d="M 29 43 L 45 27"
              />
            </svg>
          </button>
          {this.state.showHangupMessage && (
            <div className="hangup-message">
              {this.getHangupMessage()}
            </div>
          )}
        </div>
      </div>
    );
  }
}

Controller.propTypes = {
  status: PropTypes.shape(),
  setCallStatusToAvailable: PropTypes.func,
  startHangup: PropTypes.func,
  toggleVideoTrack: PropTypes.func,
  toggleAudioTrack: PropTypes.func,
  videoEnabled: PropTypes.bool,
  audioEnabled: PropTypes.bool,
};

const mapStateToProps = state => ({
  status: state.call.status,
  videoEnabled: state.call.videoEnabled,
  audioEnabled: state.call.audioEnabled,
});
const mapDispatchToProps = {
  setCallStatusToAvailable,
  toggleVideoTrack,
  toggleAudioTrack,
};

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
