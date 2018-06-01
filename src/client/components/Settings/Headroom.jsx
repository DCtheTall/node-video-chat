import React from 'react';
import '../../styles/settings-headroom.scss';

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
      <div className="flex-center settings-headroom">
        <div className="webchat-text">
          Your Settings
        </div>
      </div>
    );
  }
}

Headroom.propTypes = {};

export default Headroom;
