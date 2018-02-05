import { List, Set } from 'immutable';

export const DEFAULT_ROOM = 'Lobby';

export const MessageType = Object.freeze({
  SYSTEM_MESSAGE: 'System',
});

export default class ChatClient {
  constructor(stateChangeCallback, remoteClient) {
    this.stateChangeCallback = stateChangeCallback;
    this.nickname = undefined;
    this.currentRoom = undefined;
    this.rooms = new Set();
    this.joinedRooms = new Set();
    this.messages = {};
    this.remoteClient = remoteClient;

    this.connectWithNickname = this.connectWithNickname.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.onReceiveChatMessage = this.onReceiveChatMessage.bind(this);
    this.onReceiveSystemMessage = this.onReceiveSystemMessage.bind(this);
    this.onNewRoomCreated = this.onNewRoomCreated.bind(this);
    this.onUpdateRoomList = this.onUpdateRoomList.bind(this);
  }

  connectWithNickname(nickname) {
    this.nickname = nickname;
    this.currentRoom = DEFAULT_ROOM;
    this.addRoomToRoomsJoined(DEFAULT_ROOM);
    this.remoteClient.connect(this);
    this.notify();
  }

  addMessageToRoom(messageData) {
    const room = messageData.room ? messageData.room : DEFAULT_ROOM;
    this.addRoomToRoomsJoined(room);
    this.messages[room] = this.messages[room].push(messageData);
  }

  addSystemMessageToRoom(messageData) {
    this.addMessageToRoom({
      nickname: 'System',
      type: MessageType.SYSTEM_MESSAGE,
      ...messageData,
    });
  }

  getMessagesForCurrentRoom() {
    return this.messages[this.currentRoom];
  }

  sendMessage(message) {
    this.remoteClient.sendMessageInRoom(message, this.currentRoom);
    this.notify();
  }

  addRoomToRoomsJoined(room) {
    this.rooms = this.rooms.add(room);
    this.joinedRooms = this.joinedRooms.add(room);
    if (!this.messages[room]) {
      this.messages[room] = new List();
    }
  }

  joinRoom(room) {
    const alreadyJoined = this.joinedRooms.contains(room);
    if (!alreadyJoined) {
      this.addRoomToRoomsJoined(room);
      if (room !== DEFAULT_ROOM) {
        this.remoteClient.joinRoom(room);
      }
    }
    this.currentRoom = room;
    this.notify();
  }

  onReceiveChatMessage(messageData) {
    this.addMessageToRoom(messageData);
    this.notify();
  }

  onReceiveSystemMessage(messageData) {
    this.addSystemMessageToRoom(messageData);
    this.notify();
  }

  onNewRoomCreated(room) {
    this.addSystemMessageToRoom({ message: `A new room '${room}' was created` });
    this.notify();
  }

  onUpdateRoomList(rooms) {
    this.rooms = new Set(rooms).union([DEFAULT_ROOM]);
    this.notify();
  }

  notify() {
    this.stateChangeCallback(this);
  }
}
