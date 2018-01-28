import React, { Component } from 'react';
import './ChatrApp.css';
import NicknameForm from './components/NicknameForm';
import Chatroom from './components/Chatroom';
import ChatClient from './chat/ChatClient';
import SocketIoClient from './chat/SocketIoClient';

export default class ChatrApp extends Component {
  constructor(props) {
    super(props);

    this.setChatState = this.setChatState.bind(this);

    this.chat = new ChatClient(this.setChatState);
    this.state = { nickname: this.chat.nickname, messages: this.chat.messages };
  }

  componentWillMount() {
    this.io = new SocketIoClient(this.chat);
  }

  componentWillUnmount() {
    this.io.close();
  }

  setChatState(chat) {
    this.setState({ nickname: chat.nickname, messages: chat.messages });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">chatr</h1>
          <div id="nickname">{this.state.nickname}</div>
        </header>
        {!this.state.nickname &&
        <NicknameForm setNicknameCallback={this.chat.setNickname} />
        }
        {this.state.nickname &&
        <Chatroom sendMessageCallback={this.chat.sendMessage} messages={this.state.messages} />
        }
      </div>
    );
  }
}
