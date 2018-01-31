import SocketIO from 'socket.io';
import { ChatEvent, ServerEvent } from './shared/eventTypes';

export default class SocketIoServer {
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.io = undefined;

    this.onJoinRoom = this.onJoinRoom.bind(this);
  }

  start() {
    this.io = new SocketIO(this.httpServer);
    this.registerEventHandlers();
  }

  close() {
    this.io.close();
  }

  emitEventInRoom(room, eventType, data) {
    this.io.sockets.in(room).emit(eventType, data);
  }

  sendSystemMessageInRoom(message, room) {
    this.emitEventInRoom(
      room, ChatEvent.SYSTEM_MESSAGE_FROM_SERVER,
      { room, message },
    );
  }

  registerEventHandlers() {
    this.io.on(ServerEvent.CONNECT, (socket) => {
      const { nickname } = socket.handshake.query;
      if (nickname) {
        SocketIoServer.broadcastSystemMessage(socket, `User ${nickname} joined`);
      }

      socket.on(ChatEvent.MESSAGE_FROM_CLIENT, (data) => {
        SocketIoServer.onMessageFromClient(socket, data);
      });

      socket.on(ChatEvent.JOIN_ROOM, (data) => {
        this.onJoinRoom(socket, data);
      });
    });
  }

  onJoinRoom(socket, data) {
    socket.join(data.room);
    this.sendSystemMessageInRoom(`${data.nickname} joined room ${data.room}`, data.room);
  }

  static onMessageFromClient(socket, data) {
    socket.broadcast.emit(ChatEvent.MESSAGE_FROM_SERVER, data);
    socket.emit(ChatEvent.MESSAGE_FROM_SERVER, data);
  }

  static broadcastSystemMessage(socket, message) {
    socket.broadcast.emit(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, message);
    socket.emit(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, { message });
  }
}

