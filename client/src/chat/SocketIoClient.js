import io from 'socket.io-client';
import { ClientEvent, ChatEvent } from './shared/eventTypes';

export default class SocketIoClient {
  constructor(url = undefined) {
    this.chat = undefined;
    this.url = url;
  }

  connect(chat) {
    this.chat = chat;
    this.socket = this.url ? io(this.url) : io();
    this.initializeSocket();
  }

  initializeSocket() {
    this.socket.on(ChatEvent.MESSAGE_FROM_SERVER, (messageData) => {
      this.chat.onReceiveChatMessage(messageData);
    });

    this.socket.on(ClientEvent.ERROR, (error) => {
      this.error(`Error: ${error}`);
    });

    this.socket.on(ClientEvent.CONNECT_TIMEOUT, (timeout) => {
      this.error(`Connection timeout after ${timeout}ms`);
    });

    this.socket.on(ClientEvent.CONNECT_ERROR, (error) => {
      this.error(`Error connecting to server: ${error}`);
    });
  }

  sendMessage(messageData) {
    this.socket.emit(ChatEvent.MESSAGE_FROM_CLIENT, messageData);
  }

  error(errorMessage) {
    this.chat.onReceiveSystemMessage(errorMessage);
  }

  close() {
    this.socket.close();
  }
}
