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
          <StatusIndicator status={this.props.status} />
          <img
            src={this.props.pictureUrl}
            alt={this.props.username}
          />
          <span className="username webchat-text">
            {this.props.username}
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
  status: string,
  pictureUrl: string,
  username: string,
  history: shape(),
};

export default withRouter(Headroom);
