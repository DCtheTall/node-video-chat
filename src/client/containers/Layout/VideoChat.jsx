import React from 'react';
import PropTypes from 'prop-types';
import getSocket from '../../socket';
import '../../styles/video-chat-container.scss';

const socket = getSocket();

/**
 * @class VideoChat
 * @extends {React.PureComponent}
 */
class VideoChat extends React.PureComponent {
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
