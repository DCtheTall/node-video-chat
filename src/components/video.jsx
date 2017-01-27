import * as React from "react";

export default class Video extends React.Component {
  static propTypes = {
    peerStream: React.PropTypes.object.isRequired,
    ownStream: React.PropTypes.object.isRequired
  }
  componentDidMount() {
    let peerVideo = document.querySelector('#peer-video');
    peerVideo.src = window.URL.createObjectURL(this.props.peerStream);
    peerVideo.play();

    let ownVideo = document.querySelector('#own-video');
    ownVideo.src = window.URL.createObjectURL(this.props.ownStream);
    ownVideo.play();
  }
  render() {
    return (<div className="video-container">
      <video id="peer-video"/>
      <div id="own-video-container">
        <video id="own-video" muted />
      </div>
    </div>);
  }
}
