import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../../../styles/video-chat-controller-track-toggle.scss';

/**
 * @class TrackToggle
 * @extends {React.PureComponent}
 */
class TrackToggle extends React.PureComponent {
  /**
   * @constructor
   * @constructs TrackToggle
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { instructionsVisible: false };
    this.showInstructions = this.showInstructions.bind(this);
    this.hideInstructions = this.hideInstructions.bind(this);
  }
  /**
   * @returns {undefined}
   */
  showInstructions() {
    this.setState({ instructionsVisible: true });
  }
  /**
   * @returns {undefined}
   */
  hideInstructions() {
    this.setState({ instructionsVisible: false });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="video-chat-controller-track-toggle">
        <button
          className={this.props.trackEnabled ? '' : 'track-disabled'}
          onClick={this.props.onPress}
          onMouseEnter={this.showInstructions}
          onMouseLeave={this.hideInstructions}
        >
          <i
            className={classNames(
              'fa',
              `fa-${this.props.iconName}`,
            )}
          />
          {!this.props.trackEnabled && (
            <svg viewBox="0 0 50 50">
              <path
                className="shadow"
                strokeWidth="3"
                d="M 0 2 L 50 52"
              />
              <path
                className="red-strike"
                strokeWidth="2"
                d="M 0 0 L 50 50"
              />
            </svg>
          )}
        </button>
        {this.state.instructionsVisible && (
          <div className="explainer">
            {this.props.trackEnabled ? 'Disable' : 'Enable'} {this.props.track}
          </div>
        )}
      </div>
    );
  }
}

TrackToggle.propTypes = {
  iconName: PropTypes.string,
  onPress: PropTypes.func,
  trackEnabled: PropTypes.bool,
  track: PropTypes.string,
};

export default TrackToggle;
