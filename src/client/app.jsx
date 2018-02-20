import React from 'react';

/**
 * @class App
 * @extends {React.PureComponent}
 */
class App extends React.PureComponent {
  /**
   * @constructor
   * @constructs App
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { toggleBool: false };
    this.handleClick = this.handleClick.bind(this);
  }
  /**
   * @returns {undefined}
   */
  handleClick() {
    this.setState(
      { toggleBool: !this.state.toggleBool },
      () => console.log(this.state.toggleBool)
    );
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <button onClick={this.handleClick}>
        <span role="img" aria-label="fire">
          🔥
        </span>
      </button>
    );
  }
}

export default App;
