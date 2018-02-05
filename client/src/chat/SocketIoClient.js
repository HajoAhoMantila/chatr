import io from 'socket.io-client';
import { ClientEvent, ChatEvent } from './shared/eventTypes';

export default class SocketIoClient {
  constructor(url = undefined) {
    this.chat = undefined;
    this.url = url;
  }

  connect(chat) {
    this.chat = chat;
    const data = { query: { nickname: chat.nickname } };
    this.socket = this.url ? io(this.url, data) : io(data);
    this.initializeSocket();
  }

  initializeSocket() {
    this.socket.on(ChatEvent.MESSAGE_FROM_SERVER, (messageData) => {
      this.chat.onReceiveChatMessage(messageData);
    });

    this.socket.on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (messageData) => {
      this.chat.onReceiveSystemMessage(messageData);
    });

    this.socket.on(ChatEvent.ANNOUNCE_ROOMS, (messageData) => {
      if (messageData.newRoom) {
        this.chat.onNewRoomCreated(messageData.newRoom);
      }
      this.chat.onUpdateRoomList(messageData.rooms);
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

  joinRoom(room) {
    this.socket.emit(ChatEvent.JOIN_ROOM, { nickname: this.chat.nickname, room });
  }

  sendMessage(message) {
    this.socket.emit(ChatEvent.MESSAGE_FROM_CLIENT, { nickname: this.chat.nickname, message });
  }

  sendMessageInRoom(message, room) {
    this.socket.emit(
      ChatEvent.MESSAGE_FROM_CLIENT,
      { room, nickname: this.chat.nickname, message },
    );
  }

  error(errorMessage) {
    this.chat.onReceiveSystemMessage({ message: errorMessage });
  }

  close() {
    this.socket.close();
  }
}
