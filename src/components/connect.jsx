import * as React from "react";
import Pusher from "pusher-js";
import Peer from "simple-peer";
import wrtc from "wrtc";

export default class Connect extends React.Component {
  static propTypes = {
    setStatus: React.PropTypes.func.isRequired,
    setServer: React.PropTypes.func.isRequired,
    setPeerStream: React.PropTypes.func.isRequired,
    stream: React.PropTypes.object.isRequired
  }
  state = {
    clientID: '',
    connecting: false
  }
  connectToHost(clientID) {
    this.setState({ connecting: true });

    let pusher = new Pusher('b5ee32e8c6b0d68d380b', {
      authTransport: 'ajax',
      authEndpoint: '/pusher/auth?id=2'
    });

    let channel;
    try {
      channel = pusher.subscribe('presence-chat-'+ clientID);
    }
    catch(err) {
      console.log(err);
      this.setState({ connecting: false });
      return;
    }

    let peer;

    channel.bind('pusher:subscription_succeeded', members => {
      if(members.count != 2) {
        pusher.unsubscribe('presence-chat-'+ clientID);
        this.setState({ connecting: false });
      }
      console.log('Members: ', members);
      channel.trigger('client-connect-'+ clientID, { user_id: 2 });
    });

    channel.bind('client-host-server-created-'+ clientID, data => {
      console.log(data.message);

      let stream = this.props.stream;
      peer = new Peer({ stream, wrtc  });
      peer.on('signal', data => {
        channel.trigger('client-signal-'+ clientID, { userId: 2, data });
      });
      channel.bind('client-signal-'+ clientID, signal => {
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

      let message = 'Client server created';
      console.log(message);
      channel.trigger('client-peer-server-created', { message });
    });
  }
  render() {
    return (<div>
      {'Client: '}
      <input type='text'
             onChange={ev => this.setState({ clientID: ev.target.value })}
             disabled={this.state.connecting}/>
      <button onClick={() => this.connectToHost(this.state.clientID)}
              disabled={this.state.connecting}>Connect</button>
    </div>);
  }
}
