import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import {
  connect,
  Provider,
} from "react-redux";

import {
  setStatus,
  setStream,
} from "./actions.js";
import reducer from "./reducer.js";
import SmartHost from "./components/host.jsx";
import SmartConnect from "./components/connect.jsx";
import SmartVideo from "./components/video.jsx";
import SmartChat from "./components/chat.jsx";
import SmartDisconnected from "./components/disconnect.jsx";

let css = require('!style-loader!css-loader!sass-loader!./scss/main.scss');

const store = createStore(reducer);

class App extends React.Component {
  static propTypes = {
    setStream: React.PropTypes.func.isRequired,
  }
  componentWillMount() {
    const onSuccess = stream => this.props.setStream(stream);
    const onError = error => console.log(error);
    navigator.getUserMedia = ( navigator.mozGetUserMedia ||
                               navigator.getUserMedia ||
                               navigator.msGetUserMedia ||
                               navigator.webkitGetUserMedia );
    navigator.getUserMedia({ video: true, audio: true }, onSuccess, onError);
  }
  render() {
    let children;
    switch(this.props.status) {
      case 'hosting':
        children = (<SmartHost />);
        break;
      case 'connecting':
        children = (<SmartConnect />);
        break;
      case 'connected':
        children = (
          <div className="chat-container">
            <SmartVideo />
            <SmartChat />
          </div>
        );
        break;
      case 'disconnected':
        children = (
          <SmartDisconnected />
        );
        break;
      case 'prompting':
      default:
        children = (
          <div>
            <button onClick={() => this.props.setStatus('hosting')}>
              Host
            </button>
            <button onClick={() => this.props.setStatus('connecting')}>
              Connect
            </button>
          </div>
        );
        break;
    }
    return (
      <div className='container'>
        <h2>Peer-to-Peer Chat</h2>
        {children}
      </div>
    );
  }
}

const mapStateToProps = ({ status, server, peerServer }) => ({ status, server, peerServer });

const SmartApp = connect(mapStateToProps, { setStatus, setStream })(App);

ReactDOM.render(
  (<Provider store={store}>
    <SmartApp />
  </Provider>),
  document.getElementById('entry-point')
);
