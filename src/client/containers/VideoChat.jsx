import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CallStatuses } from '../actions/call';
import { addError } from '../actions/error';
import Available from '../components/VideoChat/Available';
import Calling from '../components/VideoChat/Calling';
import Controller from '../components/VideoChat/Controller';
import '../styles/video-chat-container.scss';

/**
 * @class VideoChat
 * @extends {React.PureComponent}
 */
class VideoChat extends React.PureComponent {
  /**
   * @static
   * @param {Object} stream to stop
   * @returns {undefined}
   */
  static stopStream(stream) {
    return stream.getTracks().forEach(track => track.stop());
  }
  /**
   * @constructor
   * @constructs VideoChat
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
  }
  /**
   * @param {Object} props component is about to use
   * @returns {undefined}
   */
  componentWillReceiveProps(props) {
    if (
      (props.status === CallStatuses.Available
        || props.status === CallStatuses.Calling)
      && this.props.status === CallStatuses.Testing
    ) {
      this.endVideo();
    }
  }
  /**
   * @param {Object} props before update
   * @returns {undefined}
   */
  componentDidUpdate(props) {
    if (
      props.status === CallStatuses.Available
      && this.props.status === CallStatuses.Testing
    ) {
      this.startVideoTest();
    }
  }
  /**
   * @returns {undefined}
   */
  endVideo() {
    this.remoteVideo.srcObject = null;
    this.localVideo.srcObject = null;
    if (this.localStream) {
      VideoChat.stopStream(this.localStream);
      this.localStream = null;
    }
    if (this.remoteStream) {
      VideoChat.stopStream(this.remoteStream);
      this.remoteStream = null;
    }
  }
  /**
   * @returns {undefined}
   */
  async startLocalVideo() {
    if (this.localVideo && this.localVideo.srcObject) return;
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.localVideo.srcObject = this.localStream;
  }
  /**
   * @returns {undefined}
   */
  async startVideoTest() {
    try {
      await this.startLocalVideo();
    } catch (err) {
      this.props.addError(/allowed/i.test(err.name) ?
        'Please allow camera access to use this app.'
        : 'Something went wrong starting the video'
      );
      return;
    }
    this.remoteVideo.srcObject = this.localStream;
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    if (this.props.status === CallStatuses.Available) {
      return <Available />;
    }
    if (this.props.status === CallStatuses.Calling) {
      return <Calling />;
    }
    return (
      <div className="video-chat-container">
        <div className="remote-video-container">
          <video
            ref={node => this.remoteVideo = node}
            className="remote-video"
            autoPlay
          >
            <track kind="captions" />
          </video>
          <video
            ref={node => this.localVideo = node}
            className="local-video"
            autoPlay
          >
            <track kind="captions" />
          </video>
        </div>
        <Controller />
      </div>
    );
  }
}

VideoChat.propTypes = {
  status: PropTypes.shape(),
  addError: PropTypes.func,
};

const mapStateToProps = state => ({
  status: state.call.status,
});
const mapDispatchToProps = {
  addError,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoChat);
