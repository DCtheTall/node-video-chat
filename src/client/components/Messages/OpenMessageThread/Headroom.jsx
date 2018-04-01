import React from 'react';
import { string, shape } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MESSAGES_ROUTE } from '../../../constants';
import StatusIndicator from '../../shared/StatusIndicator';
import '../../../styles/open-message-thread-headroom.scss';

/**
 * @class Headroom
 * @extends {React.PureComponent}
 */
class Headroom extends React.PureComponent {
  /**
   * @constructor
   * @constructs Headroom
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }
  /**
   * @returns {undefined}
   */
  close() {
    this.props.history.push(MESSAGES_ROUTE);
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="open-message-thread-headroom display-flex align-items-center">
        <div className="open-message-thread-user display-flex align-items-center">
          <StatusIndicator status={this.props.user.status} />
          <img
            src={this.props.user.pictureUrl}
            alt={this.props.user.username}
          />
          <span className="username webchat-text">
            {this.props.user.username}
          </span>
        </div>
        <button onClick={this.close}>
          &times;
        </button>
      </div>
    );
  }
}

Headroom.propTypes = {
  history: shape(),
  user: shape({
    status: string,
    pictureUrl: string,
    username: string,
  }),
};

export default withRouter(Headroom);
