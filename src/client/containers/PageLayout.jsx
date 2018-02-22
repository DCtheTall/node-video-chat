import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import HelloWorld from '../components/HelloWorld';

/**
 * @class PageLayout
 * @extends {React.PureComponent}
 */
class PageLayout extends React.Component {
  /**
   * @constructor
   * @constructs PageLaout
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { mounted: false };
  }
  componentDidMount() {
    this.setState({ mounted: true });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="app-container">
        {renderRoutes(this.props.route.routes)}
        {this.state.mounted && <HelloWorld />}
      </div>
    );
  }
}

PageLayout.propTypes = {
  route: PropTypes.shape(),
};

export default PageLayout;
