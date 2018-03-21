import React from 'react';
import PropTypes from 'prop-types';

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
      <div className="contact-list-heading text-center">
        <span className="webchat-text">
          Your Contacts
        </span>
      </div>
    );
  }
}

Headroom.propTypes = {};

export default Headroom;
