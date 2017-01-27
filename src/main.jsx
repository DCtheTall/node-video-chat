import * as React from "react";
import * as ReactDOM from "react-dom";

import Host from "./components/host.jsx";
import Connect from "./components/connect.jsx";
import Video from "./components/video.jsx";
import Chat from "./components/chat.jsx";

let css = require('!style-loader!css-loader!sass-loader!./scss/main.scss');

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      status: 'prompting',
      server: null,
      stream: null,
      peerStream: null,
    };
  }
  componentWillMount() {
    const onSuccess = stream => this.setState({ stream });
    const onError = error => console.log(error);
    navigator.getUserMedia = ( navigator.mozGetUserMedia ||
                               navigator.getUserMedia ||
                               navigator.msGetUserMedia ||
                               navigator.webkitGetUserMedia );
    navigator.getUserMedia({ video: true, audio: true }, onSuccess, onError);
  }
  render() {
    let children;
    switch(this.state.status) {
      case 'hosting':
        children = (<Host stream={this.state.stream}
                          setStatus={status => this.setState({ status })}
                          setServer={server => this.setState({ server })}
                          setPeerStream={peerStream => this.setState({ peerStream })}/>);
        break;
      case 'connecting':
        children = (<Connect stream={this.state.stream}
                             setStatus={status => this.setState({ status })}
                             setServer={server => this.setState({ server })}
                             setPeerStream={peerStream => this.setState({ peerStream })} />);
        break;
      case 'connected':
        children = (<div className="chat-container">
          <Video peerStream={this.state.peerStream}
                 ownStream={this.state.stream} />
          <Chat server={this.state.server} />
        </div>);
        break;
      case 'prompting':
      default:
        children = (<div>
          <button onClick={() => this.setState({ status: 'hosting' })}>Host</button>
          <button onClick={() => this.setState({ status: 'connecting' })}>Connect</button>
        </div>);
    }
    return (<div className='container'>
      <h2>Peer-to-Peer Chat</h2>
      {children}
    </div>);
  }
}

ReactDOM.render(<Main />, document.getElementById('entry-point'));
