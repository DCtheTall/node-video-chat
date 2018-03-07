import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../../styles/search-bar.scss';

/**
 * @class SearchBar
 * @extends {React.PureComponent}
 */
class SearchBar extends React.PureComponent {
  /**
   * @constructor
   * @constructs SearchBar
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { isFocused: false };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }
  /**
   * @returns {undefined}
   */
  onFocus() {
    this.setState({ isFocused: true });
  }
  /**
   * @returns {undefined}
   */
  onBlur() {
    this.setState({ isFocused: false });
  }
  /**
   * @param {Object} event the event
   * @returns {undefined}
   */
  onChange({ target: { value } }) {
    this.props.onChange(value);
  }
  /**
   * @returns {undefined}
   */
  clearSearch() {
    this.props.onChange('');
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div
        className={classNames(
          'search-bar display-flex align-items-center',
          this.state.isFocused && 'is-focused',
        )}
      >
        <i className="fa fa-search" />
        <input
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.onChange}
        />
        {this.props.value && (
          <button
            className="clear-search-button"
            onClick={this.clearSearch}
          >
            &times;
          </button>
        )}
      </div>
    );
  }
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SearchBar;
