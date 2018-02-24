import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import HELLO_WORLD_QUERY from '../queries/hello-world.graphql';

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
        Hello {this.props.data.user && this.props.data.user.email}
      </div>
    );
  }
}

HelloWorld.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape(),
  }),
};

export default graphql(HELLO_WORLD_QUERY)(HelloWorld);
