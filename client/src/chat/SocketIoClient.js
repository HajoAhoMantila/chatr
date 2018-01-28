import io from 'socket.io-client';

export default class SocketIoClient {
  constructor(chat, url = undefined) {
    this.chat = chat;
    this.chat.setRemoteClient(this);

    this.socket = url ? io(url) : io();
    this.initializeSocket();
  }

  initializeSocket() {
    this.socket.on('messageFromServer', (message) => {
      this.chat.onReceiveMessage(message);
    });
  }

  sendMessage(message) {
    this.socket.emit('messageFromClient', message);
  }

  close() {
    this.socket.close();
  }
}
