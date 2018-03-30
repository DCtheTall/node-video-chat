import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/open-messages.scss';

/**
 * @class Messages
 * @extends {React.PureComponent}
 */
class Messages extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="open-messages display-flex" />
    );
  }
}

Messages.propTypes = {};

export default Messages;
