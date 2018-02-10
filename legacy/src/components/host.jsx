import * as React from "react";
import Peer from "simple-peer";
import Pusher from "pusher-js";
import wrtc from "wrtc";
import { connect } from "react-redux";

import {
  setStatus,
  setServer,
  setPeerStream,
  handleDisconnect,
} from "../actions.js";

class Host extends React.Component {
  static propTypes = {
    stream: React.PropTypes.shape({}).isRequired,
    status: React.PropTypes.string.isRequired,
    setStatus: React.PropTypes.func.isRequired,
    setServer: React.PropTypes.func.isRequired,
    setPeerStream: React.PropTypes.func.isRequired,
    handleDisconnect: React.PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = { clientID: null };
  }
  componentWillMount() {
    let pusher = new Pusher('b5ee32e8c6b0d68d380b', {
      authTransport: 'ajax',
      authEndpoint: '/pusher/auth?id=1'
    });
    let clientID = Date.now().toString(16)
      , channel = pusher.subscribe(`presence-chat-${clientID}`)
      , peer;
    channel.bind('pusher:subscription_succeeded', members => {
      console.log(`Members: ${members}`);
      this.setState({ clientID });
    });
    channel.bind('pusher:member_added', member => {
      console.log(`New member: ${member}`);
    });

    channel.bind(`client-connect-${clientID}`, data => {
      console.log(`Hosting for user with id: ${data.user_id}`);

      let stream = this.props.stream;
      peer = new Peer({ initiator: true, stream, wrtc });
      peer.on('signal', data => {
        channel.trigger(`client-signal-${clientID}`, { userId: 1, data });
      });
      channel.bind(`client-signal-${clientID}`, signal => {
        peer.signal(signal.data);
      });
      console.log(peer);

      let message = 'Host server created';
      console.log(message);
      channel.trigger(`client-host-server-created-${clientID}`, { message });
    });

    channel.bind('client-peer-server-created', data => {
      console.log(data.message);

      peer.on('connect', () => {
        console.log('connected');
      });
      peer.on('stream', stream => {
        console.log('receiving remote stream');
        this.props.setPeerStream(stream);
        this.props.setServer(peer);
        this.props.setStatus('connected');
      });

      peer.on('close', () => {
        peer.destroy();
        this.props.handleDisconnect();
      });
    });
  }
  render() {
    return (
      <div>
        Hosting with key:
        <b>{this.state.clientID}</b>
      </div>
    );
  }
}

const mapStateToProps = ({ stream, status }) => ({ stream, status });

const SmartHost = connect(mapStateToProps, { setStatus, setServer, setPeerStream, handleDisconnect })(Host);

export default SmartHost;
