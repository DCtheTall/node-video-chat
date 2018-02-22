import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { HELLO_WORLD_QUERY } from '../queries/hello-world';

/**
 * @class HelloWorld
 * @extends {React.PureComponent}
 */
class HelloWorld extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div>
        Hello {this.props.helloWorld.hello}
      </div>
    );
  }
}

HelloWorld.propTypes = {
  helloWorld: PropTypes.shape({
    hello: PropTypes.string,
  }),
};

export default graphql(HELLO_WORLD_QUERY, { name: 'helloWorld' })(HelloWorld);
