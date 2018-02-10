import * as React from "react";
import Pusher from "pusher-js";
import Peer from "simple-peer";
import wrtc from "wrtc";
import { connect } from "react-redux";

import {
  setStatus,
  setServer,
  setPeerStream,
  handleDisconnect,
} from "../actions";

class Connect extends React.Component {
  static propTypes = {
    stream: React.PropTypes.shape({}).isRequired,
    setStatus: React.PropTypes.func.isRequired,
    setServer: React.PropTypes.func.isRequired,
    setPeerStream: React.PropTypes.func.isRequired,
    handleDisconnect: React.PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      clientID: '',
      connecting: false
    };
    this.connectToHost = this.connectToHost.bind(this);
  }
  connectToHost() {
    this.setState({ connecting: true });

    let pusher = new Pusher('b5ee32e8c6b0d68d380b', {
      authTransport: 'ajax',
      authEndpoint: '/pusher/auth?id=2'
    });

    let channel;
    try {
      channel = pusher.subscribe('presence-chat-'+ this.state.clientID);
    }
    catch(err) {
      console.log(err);
      this.setState({ connecting: false });
      return;
    }

    let peer;

    channel.bind('pusher:subscription_succeeded', members => {
      if(members.count != 2) {
        pusher.unsubscribe('presence-chat-'+ this.state.clientID);
        this.setState({ connecting: false });
      }
      console.log('Members: ', members);
      channel.trigger('client-connect-'+ this.state.clientID, { user_id: 2 });
    });

    channel.bind('client-host-server-created-'+ this.state.clientID, data => {
      console.log(data.message);

      let stream = this.props.stream;
      peer = new Peer({ stream, wrtc });
      peer.on('signal', data => {
        channel.trigger('client-signal-'+ this.state.clientID, { userId: 2, data });
      });
      channel.bind('client-signal-'+ this.state.clientID, signal => {
        peer.signal(signal.data);
      });
      console.log(peer);

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

      let message = 'Client server created';
      console.log(message);
      channel.trigger('client-peer-server-created', { message });
    });
  }
  render() {
    return (
      <div>
        {'Client: '}
        <input
          type='text'
          onChange={ev => this.setState({ clientID: ev.target.value })}
          disabled={this.state.connecting}
        />
        <button
          onClick={this.connectToHost}
          disabled={this.state.connecting}
        >
          Connect
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ stream }) => ({ stream });

const SmartConnect = connect(mapStateToProps, { setStatus, setServer, setPeerStream, handleDisconnect })(Connect);

export default SmartConnect;
