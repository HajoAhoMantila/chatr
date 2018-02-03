import { List } from 'immutable';

export const defaultRoom = 'Lobby';

export const MessageType = Object.freeze({
  SYSTEM_MESSAGE: 'System',
});

export default class ChatClient {
  constructor(stateChangeCallback, remoteClient) {
    this.stateChangeCallback = stateChangeCallback;
    this.nickname = undefined;
    this.currentRoom = undefined;
    this.rooms = new List();
    this.messages = {};
    this.remoteClient = remoteClient;

    this.connectWithNickname = this.connectWithNickname.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.addAndJoinRoom = this.addAndJoinRoom.bind(this);
    this.selectRoom = this.selectRoom.bind(this);
    this.onReceiveChatMessage = this.onReceiveChatMessage.bind(this);
    this.onReceiveSystemMessage = this.onReceiveSystemMessage.bind(this);
  }

  connectWithNickname(nickname) {
    this.nickname = nickname;
    this.currentRoom = defaultRoom;
    this.addRoomIfNotYetKnown(defaultRoom);
    this.remoteClient.connect(this);
    this.notify();
  }

  addRoomIfNotYetKnown(room) {
    if (!this.rooms.contains(room)) {
      this.rooms = this.rooms.push(room);
      this.messages[room] = new List();
    }
  }

  addMessageDataToRoom(messageData) {
    const room = messageData.room ? messageData.room : defaultRoom;
    this.addRoomIfNotYetKnown(room);
    this.messages[room] = this.messages[room].push(messageData);
  }

  getMessagesForCurrentRoom() {
    return this.messages[this.currentRoom];
  }

  sendMessage(message) {
    this.remoteClient.sendMessageInRoom(message, this.currentRoom);
    this.notify();
  }

  addAndJoinRoom(room) {
    this.addRoomIfNotYetKnown(room);
    this.currentRoom = room;
    this.remoteClient.joinRoom(room);
    this.notify();
  }

  selectRoom(room) {
    this.currentRoom = room;
    this.notify();
  }

  onReceiveChatMessage(messageData) {
    this.addMessageDataToRoom(messageData);
    this.notify();
  }

  onReceiveSystemMessage(messageData) {
    this.addMessageDataToRoom({
      nickname: 'System',
      type: MessageType.SYSTEM_MESSAGE,
      ...messageData });
    this.notify();
  }

  notify() {
    this.stateChangeCallback(this);
  }
}
