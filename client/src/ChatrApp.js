import React, { Component } from 'react';
import './ChatrApp.css';
import NicknameForm from './components/NicknameForm';
import Chatroom from './components/Chatroom';
import ChatroomList from './components/ChatroomList';
import ChatClient from './chat/ChatClient';
import SocketIoClient from './chat/SocketIoClient';

export default class ChatrApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: undefined,
      messages: undefined,
      currentRoom: undefined,
      rooms: undefined,
    };
    this.setChatState = this.setChatState.bind(this);
  }

  componentWillMount() {
    this.io = new SocketIoClient();
    this.chat = new ChatClient(this.setChatState, this.io);
  }

  componentWillUnmount() {
    this.io.close();
  }

  setChatState(chat) {
    this.setState(() => ({
      nickname: chat.nickname,
      messages: chat.getMessagesForCurrentRoom(),
      currentRoom: chat.currentRoom,
      rooms: chat.rooms,
    }));
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">chatr</h1>
          {this.state.nickname &&
          <div id="nickname-section">
            <div id="nickname-label">Nickname: </div>
            <div id="nickname">{this.state.nickname}</div>
          </div>
          }
        </header>

        {!this.state.nickname &&
        <NicknameForm setNicknameCallback={this.chat.connectWithNickname} />
        }

        {this.state.nickname &&
        <div>
          <ChatroomList
            currentRoom={this.state.currentRoom}
            roomNames={this.state.rooms}
            joinRoomCallback={this.chat.joinRoom}
          />
          <hr />
          <Chatroom
            name={this.state.currentRoom}
            sendMessageCallback={this.chat.sendMessage}
            messages={this.state.messages}
          />
        </div>
        }
      </div>
    );
  }
}

