import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';
import StatusIndicator from './StatusIndicator';
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
        {Boolean(this.props.status) && (
          <StatusIndicator status={this.props.status} />
        )}
        <img
          src={this.props.pictureUrl}
          alt={this.props.username}
        />
        <div className="flex-column">
          <span className="username">
            {this.props.username}
          </span>
          <span className="grey-text">
            {this.props.email || this.props.message}
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
  status: string,
  message: string,
};

export default UserInfo;
