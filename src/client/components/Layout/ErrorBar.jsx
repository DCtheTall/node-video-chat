import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearError } from '../../actions/error';
import '../../styles/error-bar.scss';

/**
 * @class ErrorBar
 * @extends {React.PureComponent}
 */
class ErrorBar extends React.PureComponent {
  /**
   * @returns {undefined}
   */
  componentDidUpdate() {
    if (this.props.error) {
      this.errorTimeout = setTimeout(this.props.clearError, 5000);
      return;
    }
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    if (!this.props.error) return null;
    return (
      <div className="error-bar display-flex align-items-center">
        <div className="error text-center">
          <span>
            {this.props.error}
          </span>
        </div>
        <div className="clear-error">
          <button onClick={this.props.clearError}>
            &times;
          </button>
        </div>
      </div>
    );
  }
}

ErrorBar.propTypes = {
  error: PropTypes.string,
  clearError: PropTypes.func,
};

const mapStateToProps = state => ({ error: state.error });
const mapDispatchToProps = {
  clearError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBar);
