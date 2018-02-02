import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import './Chatroom.css';

export default class Chatroom extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    messages: PropTypes.instanceOf(List).isRequired,
    sendMessageCallback: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.endOfListElement = undefined;
    this.messageInput = undefined;
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate() {
    this.scrollToEndOfMessageList();
  }

  scrollToEndOfMessageList() {
    this.endOfListElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleMessageSubmit(event) {
    this.props.sendMessageCallback(this.messageInput.value, this.props.name);
    this.messageInput.value = '';
    event.preventDefault();
  }

  chatMessageListItems() {
    const messageKey = (message, index) => `${message.message}-${index}`;
    const messageId = (message, index) => `${message.nickname}-${index}`;

    const { messages } = this.props;
    return messages.map((message, index) => (
      <div id={messageId(message, index)} key={messageKey(message, index)}>
        <div className="message">
          <div className="message-nickname">{message.nickname}:</div>
          <div className="message-message">{message.message}</div>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div id="chatroom">
        <div id="chatroom-name">{this.props.name}</div>

        <div id="chat-message-list">
          {this.chatMessageListItems()}
          <div ref={(element) => { this.endOfListElement = element; }} />
        </div>

        <form onSubmit={this.handleMessageSubmit}>
          <input
            id="message-input-text"
            type="text"
            ref={(ref) => { this.messageInput = ref; }}
            placeholder="Enter a chat message..."
          />
          <input id="message-input-submit" type="submit" value="Send" />
        </form>
      </div>
    );
  }
}

