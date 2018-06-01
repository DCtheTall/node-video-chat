import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../Layout/Loader';
import '../../styles/settings-form-row.scss';

/**
 * @class FormRow
 * @extends {React.PureComponent}
 */
class FormRow extends React.PureComponent {
  /**
   * @constructor
   * @constructs FormRow
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { editing: false, newValue: props.value };
    this.toggleEditing = this.toggleEditing.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  /**
   * @param {Object} props component will receive
   * @returns {undefined}
   */
  componentWillReceiveProps(props) {
    if (props.value !== this.props.value) this.setState({ newValue: props.value });
  }
  /**
   * @returns {undefined}
   */
  async onSubmit() {
    if (!this.state.newValue) return;
    await this.props.onSubmit(this.state.newValue.trim());
    this.setState({ editing: false, newValue: this.props.value });
  }
  /**
   * @param {Object} ev the change event
   * @returns {undefined}
   */
  onValueChange(ev) {
    this.setState({ newValue: ev.target.value });
  }
  /**
   * @returns {undefined}
   */
  toggleEditing() {
    this.setState({ editing: !this.state.editing });
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    if (this.props.loading) {
      return (
        <div className="settings-form-row">
          <div className="label">
            {this.props.label}
          </div>
          <Loader />
        </div>
      );
    }
    return (
      <div className="settings-form-row">
        <div className="label">
          {this.props.label}
        </div>
        {this.state.editing ? (
          <div className="display-flex space-between">
            <input
              type="text"
              value={this.state.newValue}
              onChange={this.onValueChange}
              placeholder={this.props.value}
            />
            <div className="display-flex">
              <button className="edit-button cancel" onClick={this.toggleEditing}>
                <i className="fa fa-times" />
              </button>
              <button className="edit-button submit" onClick={this.onSubmit}>
                <i className="fa fa-send" />
              </button>
            </div>
          </div>
        ) : (
          <div className="display-flex space-between">
            <div className="value">
              {this.props.value}
            </div>
            <button className="webchat-button" onClick={this.toggleEditing}>
              EDIT
            </button>
          </div>
        )}
      </div>
    );
  }
}

FormRow.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.string,
  label: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default FormRow;
