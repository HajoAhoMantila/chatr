import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import './ChatroomList.css';

export default class ChatroomList extends Component {
  static propTypes = {
    currentRoom: PropTypes.string.isRequired,
    roomNames: PropTypes.instanceOf(List).isRequired,
  };

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
      </div>
    );
  }
}

