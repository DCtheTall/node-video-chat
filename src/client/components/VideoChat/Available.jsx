import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setCallStatusToTesting } from '../../actions/call';
import '../../styles/video-chat-available.scss';

/**
 * @class Available
 * @extends {React.PureComponent}
 */
class Available extends React.PureComponent {
  /**
   * @constructor
   * @constructs Available
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.startTest = this.startTest.bind(this);
  }
  /**
   * @returns {undefined}
   */
  startTest() {
    this.props.setCallStatusToTesting();
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="full-width full-height flex-center video-chat-available">
        <div className="text-center instructions">
          Click on the
          &nbsp;
          <i className="fa fa-video-camera" />
          &nbsp;
          icon to start a call with a contact who is online.
        </div>
        <button className="webchat-button" onClick={this.startTest}>
          TEST VIDEO
        </button>
      </div>
    );
  }
}

Available.propTypes = {
  setCallStatusToTesting: PropTypes.func,
};

// const mapStateToProps = state => ({});
const mapDispatchToProps = {
  setCallStatusToTesting,
};

export default connect(null, mapDispatchToProps)(Available);
