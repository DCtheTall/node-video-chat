import React from 'react';
// import PropTypes from 'prop-types';
import '../../../styles/message-thread-list-headroom.scss';

/**
 * @class Headroom
 * @extends {React.PureComponent}
 */
class Headroom extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="message-thread-list-headroom flex-center">
        <div className="webchat-text">
          Messages
        </div>
      </div>
    );
  }
}

Headroom.propTypes = {};

export default Headroom;
