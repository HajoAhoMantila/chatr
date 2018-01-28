import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
  }

  handleMessageChange(event) {
    this.message = event.target.value;
  }

  handleMessageSubmit(event) {
    this.props.sendMessageCallback(this.message);
    event.preventDefault();
  }

  chatMessageListItems() {
    const messageKey = (message, index) => `${message.message}-${index}`;
    const messageId = (message, index) => `${message.nickname}-${index}`;

    const { messages } = this.props;
    return messages.map((message, index) => (
      <li id={messageId(message, index)} key={messageKey(message, index)}>
        <div>{message.nickname}: </div><div>{message.message}</div>
      </li>
    ));
  }

  render() {
    return (
      <div>
        <ul id="chat-message-list">{this.chatMessageListItems()}</ul>
        <form onSubmit={this.handleMessageSubmit}>
          <input
            id="message-input-text"
            type="text"
            onChange={this.handleMessageChange}
          />
          <input id="message-input-submit" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

Chatroom.propTypes = {
  messages: PropTypes.instanceOf(List).isRequired,
  sendMessageCallback: PropTypes.func.isRequired,
};

