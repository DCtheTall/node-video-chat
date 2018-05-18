import React from 'react';
import PropTypes from 'prop-types';
import '../styles/video-chat-container.scss';

/**
 * @class VideoChat
 * @extends {React.PureComponent}
 */
class VideoChat extends React.PureComponent {
  /**
   * @constructor
   * @constructs VideoChat
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { // storing all non-serealizable objects in this container's state
      localStream: null,
      remoteStream: null,
      peerConnection: null,
    };
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="video-chat-container" />
    );
  }
}

VideoChat.propTypes = {};

export default VideoChat;
