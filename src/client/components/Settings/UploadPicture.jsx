import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { compose } from 'redux';

import UPDATE_PICTURE_MUTATION from '../../graphql/mutations/user/update-picture.graphql';
import USER_SETTINGS_QUERY from '../../graphql/queries/user/settings.graphql';
import { addError } from '../../actions/error';
import { addNotice } from '../../actions/notice';
import Loader from '../Layout/Loader';

import '../../styles/settings-upload-picture.scss';

/**
 * @class UploadPicture
 * @extends {React.PureComponent}
 */
class UploadPicture extends React.PureComponent {
  /**
   * @constructor
   * @constructs UploadPicture
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = { loading: false, extension: null };
    this.onClick = this.onClick.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }
  /**
   * @returns {undefined}
   */
  onClick() {
    this.fileInput.click();
  }
  /**
   * handleFileInputChange
   * @param {Object} event the event
   * @param {Array<File>} event.target.files the uploaded files
   * @returns {undefined}
   */
  onFileChange({ target: { files } }) {
    const [file] = files;
    const extension = file.name.split('.').pop();
    if (!file || !file.size) {
      this.props.addError('Image file failed to upload');
      this.state.uploading = false;
    } else if (file && file.size >= 2e5) {
      this.props.addError('File size cannot exceed 200KB');
      this.state.uploading = false;
    } else if (!['png', 'jpg'].includes(extension)) {
      this.props.addError('You must use .png or .jpg');
      this.state.uploading = false;
    } else {
      this.setState({ extension }, () => this.readFile(file));
    }
  }
  /**
   * @param {Image} img object
   * @returns {undefined}
   */
  cropImage(img) {
    const bufferCanvas = document.createElement('canvas');
    const bufferCtx = bufferCanvas.getContext('2d');
    const toCanvas = document.createElement('canvas');
    const toCtx = toCanvas.getContext('2d');
    const min = Math.min(img.width, img.height);
    bufferCanvas.width = img.width;
    bufferCanvas.height = img.height;
    bufferCtx.drawImage(img, 0, 0);
    toCanvas.width = min;
    toCanvas.height = min;
    toCtx.drawImage(
      bufferCanvas,
      (img.width - min) / 2,
      (img.height - min) / 2,
      img.width,
      img.height,
      0, // (img.width - min) / 2,
      0, // (img.height - min) / 2,
      img.width,
      img.height,
    );
    this.uploadFile(toCanvas.toDataURL());
  }
  /**
   * @param {Object} file that was uploaded to the browser
   * @returns {undefined}
   */
  readFile(file) {
    const fr = new FileReader();
    const _this = this;

    fr.readAsDataURL(file);
    fr.addEventListener('load', function onImageLoad() { // eslint-disable-line prefer-arrow-callback
      const fileUrl = this.result;
      const img = new Image();

      img.src = fileUrl;
      img.onload = () => {
        if (img.width > 250 || img.height > 250) {
          _this.props.addError('Image cannot be greater than 250px by 250px');
          _this.state.uploading = false;
        } else if (img.width < 100 || img.height < 100) {
          _this.props.addError('Image must be at least 100px by 100px');
          _this.state.uploading = false;
        } else {
          _this.cropImage(img);
        }
      };
    });
  }
  /**
   * @param {string} stateToUpdate key in state to update
   * @returns {undefined}
   */
  async handleError() {
    await new Promise(resolve => this.setState({ loading: false, extension: null }, resolve));
    return this.props.addError('Something went wrong updating your picture.');
  }
  /**
   * @param {string} imgUrl the image data url
   * @returns {undefined}
   */
  async uploadFile(imgUrl) {
    await new Promise(res => this.setState({ loading: true }, res));
    try {
      const { data } = await this.props.updatePicture({
        variables: {
          fileUrl: imgUrl,
          extension: this.state.extension,
        },
        refetchQueries: [{ query: USER_SETTINGS_QUERY }],
      });
      if (!data.result || !data.result.success) return this.handleError();
      await new Promise(res => this.setState({ loading: false }, res));
      return this.props.addNotice('Your picture has been updated.');
    } catch (err) {
      console.log(err);
      return this.handleError();
    }
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <div className="settings-upload-picture-container">
        <input
          ref={node => this.fileInput = node}
          type="file"
          onChange={this.onFileChange}
        />
        {this.state.loading ? (
          <div className="flex-center">
            <Loader />
          </div>
        ) : (
          <div className="settings-upload-picture display-flex align-items-center">
            <img
              src={this.props.pictureUrl}
              alt={this.props.username}
            />
            <div className="text">
              <div className="heading">
                Current Picture
              </div>
              <button className="webchat-button" onClick={this.onClick}>
                CHANGE
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

UploadPicture.propTypes = {
  pictureUrl: PropTypes.string,
  username: PropTypes.string,
  addError: PropTypes.func,
  addNotice: PropTypes.func,
  updatePicture: PropTypes.func,
};

export default compose(
  connect(
    null,
    { addError, addNotice }
  ),
  graphql(
    UPDATE_PICTURE_MUTATION,
    { name: 'updatePicture' },
  ),
)(UploadPicture);
