import PropTypes from 'prop-types';
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

    this.state = { nickname: undefined, messages: undefined };
  }

  componentWillMount() {
    this.io = this.props.remoteClient ? this.props.remoteClient : new SocketIoClient();
    this.chat = this.props.chat ? this.props.chat : new ChatClient(this.setChatState, this.io);
  }

  componentWillUnmount() {
    this.io.close();
  }

  setChatState(chat) {
    this.setState(() => ({ nickname: chat.nickname, messages: chat.messages }));
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
        <Chatroom
          sendMessageCallback={this.chat.sendMessage}
          messages={this.state.messages}
        />
        }
      </div>
    );
  }
}

// eslint: PropTypes.object is required to allow passing in a mock
ChatrApp.propTypes = {
  chat: PropTypes.instanceOf(ChatClient),
  remoteClient: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

ChatrApp.defaultProps = {
  chat: undefined,
  remoteClient: undefined,
};
