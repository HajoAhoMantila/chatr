import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import './Chatroom.css';

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.endOfListElement = undefined;
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate() {
    this.scrollToEndOfMessageList();
  }

  scrollToEndOfMessageList() {
    this.endOfListElement.scrollIntoView({ behavior: 'smooth' });
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
        <div id="chat-message-list">
          {this.chatMessageListItems()}
          <div ref={(element) => { this.endOfListElement = element; }} />
        </div>
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

