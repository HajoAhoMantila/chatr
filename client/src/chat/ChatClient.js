import { List } from 'immutable';

export default class ChatClient {
  constructor(stateChangeCallback, remoteClient) {
    this.stateChangeCallback = stateChangeCallback;
    this.nickname = undefined;
    this.messages = new List();
    this.remoteClient = remoteClient;

    this.setNickname = this.setNickname.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onReceiveChatMessage = this.onReceiveChatMessage.bind(this);
  }

  setNickname(nickname) {
    this.nickname = nickname;
    this.remoteClient.connect(this);
    this.notify();
  }

  sendMessage(message) {
    this.remoteClient.sendMessage(message);
    this.notify();
  }

  onReceiveChatMessage(message) {
    this.messages = this.messages.push(message);
    this.notify();
  }

  onReceiveSystemMessage(message) {
    this.messages = this.messages.push(message);
    this.notify();
  }

  notify() {
    this.stateChangeCallback(this);
  }
}
