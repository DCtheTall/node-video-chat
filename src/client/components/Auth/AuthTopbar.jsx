import React from 'react';
import '../../styles/auth-top-bar.scss';

/**
 * @class AuthTopbar
 * @extends {React.PureComponent}
 */
class AuthTopbar extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="auth-top-bar display-flex align-items-center">
        <span className="webchat-text">
          WebChat
        </span>
      </div>
    );
  }
}

export default AuthTopbar;
