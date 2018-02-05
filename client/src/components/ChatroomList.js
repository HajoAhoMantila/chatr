import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import './ChatroomList.css';

export default class ChatroomList extends Component {
  static propTypes = {
    currentRoom: PropTypes.string.isRequired,
    roomNames: PropTypes.instanceOf(Set).isRequired,
    joinRoomCallback: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.newChatRoomInput = undefined;
    this.handleNewChatRoomSubmit = this.handleNewChatRoomSubmit.bind(this);
    this.handleClickRoomName = this.handleClickRoomName.bind(this);
  }

  handleNewChatRoomSubmit(event) {
    event.preventDefault();
    const roomName = this.newChatRoomInput.value;
    if (roomName) {
      this.props.joinRoomCallback(this.newChatRoomInput.value);
    }
    this.newChatRoomInput.value = '';
  }

  handleClickRoomName(event, roomName) {
    event.preventDefault();
    this.props.joinRoomCallback(roomName);
  }

  chatroomListItems() {
    const { roomNames, currentRoom } = this.props;
    const getRoomNameClass = roomName => (roomName === currentRoom ? 'roomname-selected' : 'roomname');

    return roomNames.map(roomName => (
      <button
        id={`room-${roomName}`}
        key={roomName}
        className={getRoomNameClass(roomName)}
        onClick={e => this.handleClickRoomName(e, roomName)}
      >
        {roomName}
      </button>
    ));
  }

  render() {
    return (
      <div id="chatrooms-list">
        <div id="chatrooms-label">Chatrooms</div>
        {this.chatroomListItems()}

        <form onSubmit={this.handleNewChatRoomSubmit}>
          <input
            id="newchatroom-input-text"
            type="text"
            ref={(ref) => {
              this.newChatRoomInput = ref;
            }}
            placeholder="Enter a room name"
          />
          <input id="newchatroom-input-submit" type="submit" value="Join room" />
        </form>
      </div>
    );
  }
}

