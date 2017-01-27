import * as React from "react";

export default class Chat extends React.Component {
  static propTypes = {
    server: React.PropTypes.object.isRequired
  }
  state = {
    messages: [],
    message: ''
  }
  componentWillMount() {
    this.props.server.on('data', data => {
      var messages = this.state.messages;
      messages.push({ status: 'received', text: ''+ data });
      this.setState({ messages });
    });
  }
  sendMessage() {
    this.props.server.send(this.state.message);
    var messages = this.state.messages;
    messages.push({ status: 'sent', text: this.state.message });
    this.setState({ message: '' });
  }
  render() {
    return (<div className="message-container">
      <div className='message-display'>
        {this.state.messages.map((msg, i) =>
          (<span key={i}>
            <span className='msg-tag'>{(msg.status === 'received' ? 'Friend>  ' : 'You>  ')}</span>
            {msg.text}<br/>
          </span>)
        )}
      </div>
      <input className='message-input'
             type='text'
             onChange={ev => this.setState({ message: ev.target.value })}
             value={this.state.message}/>
      <button disabled={this.state.message === ''}
              onClick={ev => this.sendMessage()}>Send</button>
    </div>);
  }
}
