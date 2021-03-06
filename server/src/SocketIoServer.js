import SocketIO from 'socket.io';
import { Set } from 'immutable';
import { ChatEvent, ServerEvent } from './shared/eventTypes';

export default class SocketIoServer {
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.io = undefined;
    this.rooms = Set();
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

  registerEventHandlers() {
    this.io.on(ServerEvent.CONNECT, (socket) => {
      const { nickname } = socket.handshake.query;
      this.welcomeClient(nickname, socket);

      socket.on(ChatEvent.MESSAGE_FROM_CLIENT, (data) => {
        SocketIoServer.onMessageFromClient(socket, data);
      });

      socket.on(ChatEvent.JOIN_ROOM, (data) => {
        this.onJoinRoom(socket, data);
      });
    });
  }

  welcomeClient(nickname, socket) {
    if (nickname) {
      this.broadcastToAllInDefaultRoom(ChatEvent.ANNOUNCE_JOIN, { nickname });
    }
    this.announceRoomsToClient(socket);
  }

  announceRoomsToClient(socket) {
    socket.emit(ChatEvent.ANNOUNCE_ROOMS, { rooms: this.rooms });
  }

  onJoinRoom(socket, data) {
    socket.join(data.room);

    this.emitEventInRoom(
      data.room, ChatEvent.ANNOUNCE_JOIN,
      { room: data.room, nickname: data.nickname },
    );
    this.addAndAnnounceRoom(data.room);
  }

  static onMessageFromClient(socket, data) {
    socket.broadcast.emit(ChatEvent.MESSAGE_FROM_SERVER, data);
    socket.emit(ChatEvent.MESSAGE_FROM_SERVER, data);
  }

  addAndAnnounceRoom(room) {
    if (!this.rooms.includes(room)) {
      this.rooms = this.rooms.add(room);
      this.broadcastToAllInDefaultRoom(
        ChatEvent.ANNOUNCE_ROOMS,
        { newRoom: room, rooms: this.rooms },
      );
    }
  }

  broadcastToAllInDefaultRoom(eventType, data) {
    this.io.of('/').emit(eventType, data);
  }
}

