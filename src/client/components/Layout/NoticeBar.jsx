import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { clearNotice } from '../../actions/notice';
import '../../styles/notice-bar.scss';

/**
 * @class NoticeBar
 * @extends {React.PureComponent}
 */
class NoticeBar extends React.PureComponent {
  /**
   * @param {Object} props before update
   * @returns {undefined}
   */
  componentDidUpdate(props) {
    if (props.notice !== this.props.notice) {
      if (this.noticeTimeout) {
        clearTimeout(this.noticeTimeout);
        this.noticeTimeout = null;
      }
      this.noticeTimeout = setTimeout(() => {
        this.props.clearNotice();
        this.noticeTimeout = null;
      }, 5000);
    }
  }
  /**
   * @returns {JSX.Element} HTML
   */
  render() {
    if (!this.props.notice) return null;
    return (
      <div
        className={classNames(
          'notice-bar',
          'display-flex',
          'align-items-center',
          !this.props.errorShowing && 'shadow',
        )}
      >
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
  errorShowing: PropTypes.bool,
  notice: PropTypes.string,
  clearNotice: PropTypes.func,
};

const mapStateToProps = state => ({
  errorShowing: Boolean(state.error),
  notice: state.notice,
});
const mapDispatchToProps = { clearNotice };

export default connect(mapStateToProps, mapDispatchToProps)(NoticeBar);
