import React from 'react';
import '../../styles/loader.scss';

/**
 * @class Loader
 * @extends {React.PureComponent}
 */
class Loader extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="loader-container flex-center">
        <div className="loader">
          {[...Array(6)].map((e, i) => (
            <div
              key={`loader-circle loader-circle-${i}`}
              className={`loader-circle loader-circle-${i}`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Loader;
