import io from 'socket.io-client';

export default class SocketIoClient {
  constructor(url = undefined, timeout = 20000) {
    this.chat = undefined;
    this.url = url;
    this.timeout = timeout;
  }

  connect(chat) {
    const ioOptions = { timeout: this.timeout };
    this.chat = chat;
    this.socket = this.url ? io(this.url, ioOptions) : io({ options: ioOptions });
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
    this.chat.onReceiveChatMessage(errorMessage);
  }

  close() {
    this.socket.close();
  }
}
