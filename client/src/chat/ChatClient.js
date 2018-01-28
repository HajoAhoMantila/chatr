import { List } from 'immutable';

export default class ChatClient {
  constructor(stateChangeCallback) {
    this.stateChangeCallback = stateChangeCallback;
    this.nickname = undefined;
    this.messages = new List();

    this.setNickname = this.setNickname.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onReceiveMessage = this.onReceiveMessage.bind(this);
  }

  setRemoteClient(remoteClient) {
    this.remoteClient = remoteClient;
  }

  setNickname(nickname) {
    this.nickname = nickname;
    this.notify();
  }

  sendMessage(message) {
    this.remoteClient.sendMessage(message);
    this.notify();
  }

  onReceiveMessage(message) {
    this.messages = this.messages.push(message);
    this.notify();
  }

  notify() {
    this.stateChangeCallback(this);
  }
}
