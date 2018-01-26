import React, { Component } from 'react';
import './ChatrApp.css';
import NicknameForm from './components/NicknameForm';
import Chatroom from './components/Chatroom';

export default class ChatrApp extends Component {
  constructor(props) {
    super(props);
    this.state = { nickname: undefined, messages: [] };
    this.setNickname = this.setNickname.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  setNickname(input) {
    this.setState({ nickname: input });
  }

  sendMessage(message) {
    this.setState(prevState => ({ messages: [...prevState.messages, message] }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">chatr</h1>
          <div id="nickname">{this.state.nickname}</div>
        </header>
        {!this.state.nickname &&
        <NicknameForm setNicknameCallback={this.setNickname} />
        }
        {this.state.nickname &&
        <Chatroom sendMessageCallback={this.sendMessage} messages={this.state.messages} />
        }
      </div>
    );
  }
}
