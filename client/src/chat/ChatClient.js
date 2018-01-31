import { List } from 'immutable';

export default class ChatClient {
  constructor(stateChangeCallback, remoteClient) {
    this.stateChangeCallback = stateChangeCallback;
    this.nickname = undefined;
    this.currentRoom = undefined;
    this.rooms = new List();
    this.messages = new List();
    this.remoteClient = remoteClient;

    this.connectWithNickname = this.connectWithNickname.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onReceiveChatMessage = this.onReceiveChatMessage.bind(this);
    this.onReceiveSystemMessage = this.onReceiveSystemMessage.bind(this);
  }

  connectWithNickname(nickname) {
    this.nickname = nickname;
    this.currentRoom = 'Lobby';
    this.rooms = new List(['Lobby']);
    this.remoteClient.connect(this);
    this.notify();
  }

  sendMessage(message) {
    this.remoteClient.sendMessage({ nickname: this.nickname, message });
    this.notify();
  }

  onReceiveChatMessage(messageData) {
    this.messages = this.messages.push(messageData);
    this.notify();
  }

  onReceiveSystemMessage(messageData) {
    this.messages = this.messages.push({ nickname: 'System', ...messageData });
    this.notify();
  }

  notify() {
    this.stateChangeCallback(this);
  }
}
