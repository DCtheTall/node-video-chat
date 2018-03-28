import React from 'react';
import { string } from 'prop-types';

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
      <div className="open-message-thread-headroom display-flex align-items-center">
        <div className="open-message-thread-user display-flex align-items-center">
          <img
            src={this.props.pictureUrl}
            alt={this.props.username}
          />
          <span className="username webchat-text">
            {this.props.username}
          </span>
        </div>
      </div>
    );
  }
}

Headroom.propTypes = {
  pictureUrl: string,
  username: string,
};

export default Headroom;
