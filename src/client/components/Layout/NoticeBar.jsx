import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearNotice } from '../../actions/notice';
import '../../styles/notice-bar.scss';

/**
 * @class NoticeBar
 * @extends {React.PureComponent}
 */
class NoticeBar extends React.PureComponent {
  /**
   * @returns {undefined}
   */
  componentDidUpdate() {
    if (this.noticeTimeout) {
      clearTimeout(this.noticeTimeout);
      this.noticeTimeout = null;
    }
    if (this.props.notice) {
      this.noticeTimeout = setTimeout(this.props.clearNotice, 5000);
    }
  }
  /**
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="notice-bar display-flex align-items-center">
        <div className="notice text-center">
          <span>
            {this.props.notice}
          </span>
        </div>
        <div className="clear-notice">
          <button onClick={this.props.clearNotice}>
            &times;
          </button>
        </div>
      </div>
    );
  }
}

NoticeBar.propTypes = {
  notice: PropTypes.string,
  clearNotice: PropTypes.string,
};

const mapStateToProps = state => ({ notice: state.notice });
const mapDispatchToProps = { clearNotice };

export default connect(mapStateToProps, mapDispatchToProps)(NoticeBar);
