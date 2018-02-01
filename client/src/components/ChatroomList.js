import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import './ChatroomList.css';

export default class ChatroomList extends Component {
  static propTypes = {
    currentRoom: PropTypes.string.isRequired,
    roomNames: PropTypes.instanceOf(List).isRequired,
    createRoomCallback: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleNewChatRoomSubmit = this.handleNewChatRoomSubmit.bind(this);
  }

  handleNewChatRoomSubmit(event) {
    this.props.createRoomCallback(this.newChatRoomInput.value);
    event.preventDefault();
  }

  chatroomListItems() {
    const { roomNames, currentRoom } = this.props;
    const getRoomNameClass = roomName => (roomName === currentRoom ? 'roomname-selected' : 'roomname');

    return roomNames.map(roomName => (
      <div
        id={roomName}
        key={roomName}
        className={getRoomNameClass(roomName)}
      >
        {roomName}
      </div>
    ));
  }

  render() {
    return (
      <div id="chatroom-list">
        {this.chatroomListItems()}

        <form onSubmit={this.handleNewChatRoomSubmit}>
          <input
            id="newchatroom-input-text"
            type="text"
            ref={(ref) => { this.newChatRoomInput = ref; }}
          />
          <input id="newchatroom-input-submit" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

