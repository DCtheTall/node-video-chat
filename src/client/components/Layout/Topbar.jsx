import React from 'react';
import { withRouter } from 'react-router';
import '../../styles/topbar.scss';

/**
 * @class AuthTopbar
 * @extends {React.PureComponent}
 */
class Topbar extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="topbar display-flex align-items-center">
        <span className="webchat-text">
          WebChat
        </span>
      </div>
    );
  }
}

export default withRouter(Topbar);
