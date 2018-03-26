import React from 'react';
import { string } from 'prop-types';
import '../../styles/user-info.scss';

/**
 * @class UserInfo
 * @extends {React.PureComponent}
 */
class UserInfo extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="user-info display-flex align-items-center">
        <img
          src={this.props.pictureUrl}
          alt={this.props.username}
        />
        <div className="flex-column">
          <span className="username">
            {this.props.username}
          </span>
          <span className="email">
            {this.props.email}
          </span>
        </div>
      </div>
    );
  }
}

UserInfo.propTypes = {
  pictureUrl: string,
  email: string,
  username: string,
};

export default UserInfo;
