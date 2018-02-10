import * as React from "react";
import { connect } from "react-redux";

import { disconnect } from "../actions";

class Video extends React.Component {
  static propTypes = {
    server: React.PropTypes.shape({}).isRequired,
    peerStream: React.PropTypes.shape({}).isRequired,
    stream: React.PropTypes.shape({}).isRequired,
    disconnect: React.PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.disconnect = this.disconnect.bind(this);
  }
  componentDidMount() {
    let peerVideo = document.querySelector('#peer-video');
    peerVideo.src = window.URL.createObjectURL(this.props.peerStream);
    peerVideo.play();

    let ownVideo = document.querySelector('#own-video');
    ownVideo.src = window.URL.createObjectURL(this.props.stream);
    ownVideo.play();
  }
  disconnect() {
    this.props.server.destroy();
    this.props.disconnect();
  }
  render() {
    return (
      <div className="video-container">
        <video id="peer-video"/>
        <div className="own-video-container">
          <video id="own-video" muted />
        </div>
        <button
          className="end-call-btn"
          onClick={this.disconnect}
        >
          &times;
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ server, peerStream, stream }) => ({ server, peerStream, stream });

const SmartVideo = connect(mapStateToProps, { disconnect })(Video);

export default SmartVideo;
