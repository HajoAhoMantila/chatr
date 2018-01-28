import io from 'socket.io-client';

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
    this.socket.on('messageFromServer', (messageData) => {
      this.chat.onReceiveChatMessage(messageData);
    });

    this.socket.on('error', (error) => {
      this.error(`Error: ${error}`);
    });

    this.socket.on('connect_timeout', (timeout) => {
      this.error(`Connection timeout after ${timeout}ms`);
    });

    this.socket.on('connect_error', (error) => {
      this.error(`Error connecting to server: ${error}`);
    });
  }

  sendMessage(messageData) {
    this.socket.emit('messageFromClient', messageData);
  }

  error(errorMessage) {
    this.chat.onReceiveSystemMessage(errorMessage);
  }

  close() {
    this.socket.close();
  }
}
