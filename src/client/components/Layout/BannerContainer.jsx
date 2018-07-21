import React from 'react';

import NoticeBar from './NoticeBar';
import ErrorBar from './ErrorBar';

import '../../styles/banner-container.scss';

/**
 * @class BannerContainer
 * @extends {React.PureComponent}
 */
class BannerContainer extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="banner-container">
        <NoticeBar />
        <ErrorBar />
      </div>
    );
  }
}

export default BannerContainer;
