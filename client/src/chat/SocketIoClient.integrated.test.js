/* -disable no-unused-vars,max-len */
import express from 'express';
import http from 'http';
import deepEqual from 'deep-equal';
import ChatClient from './ChatClient';
import SocketIoClient from './SocketIoClient';
import SocketIoServer from '../../../server/src/SocketIoServer';

jest.mock('./ChatClient');

const testPort = 9000;
const url = `http://localhost:${testPort}/`;
let server;
let ioClient;
let ioServer;

const defaultChatClientMock = {
  nickname: undefined,
  onReceiveChatMessage: jest.fn(),
  onReceiveSystemMessage: jest.fn(),
  onNewRoomCreated: jest.fn(),
  onUpdateRoomList: jest.fn(),
};

describe('Socket.io client/server integration tests', () => {
  beforeEach((done) => {
    server = http.Server(express());
    ioServer = new SocketIoServer(server);
    ioServer.start();
    server.listen(testPort);

    ioClient = new SocketIoClient(url);
    done();
  });

  afterEach((done) => {
    ioClient.close();
    ioServer.close();
    server.close();
    done();
  });

  test('Socket.io client connects and receives join message', (done) => {
    const nickname = 'Alice';
    ChatClient.mockImplementation(() => (Object.assign({}, defaultChatClientMock, {
      nickname,

      onReceiveSystemMessage: (message) => {
        expect(message).toEqual({ message: `User ${nickname} joined` });
        done();
      },
    })));

    ioClient.connect(new ChatClient());
  });

  test('Socket.io client can send and receives message to default room', (done) => {
    const nickname = 'Alice';
    const message = 'foobar';

    ChatClient.mockImplementation(() => (Object.assign({}, defaultChatClientMock, {
      nickname,

      onReceiveChatMessage: (receivedMessage) => {
        expect(receivedMessage).toEqual({ nickname, message });
        done();
      },
    })));

    ioClient.connect(new ChatClient());
    ioClient.sendMessage(message);
  });

  test('Socket.io client can join room', (done) => {
    const room = 'Kitchen';
    const nickname = 'Alice';

    ChatClient.mockImplementation(() => (Object.assign({}, defaultChatClientMock, {
      nickname,

      onReceiveSystemMessage: (message) => {
        if (deepEqual(message, { room, message: `${nickname} joined room ${room}` })) {
          done();
        }
      },
    })));

    ioClient.connect(new ChatClient());
    ioClient.joinRoom('Kitchen');
  });

  test('Socket.io client can send and receive message in room', (done) => {
    const nickname = 'Alice';
    const room = 'Python';
    const message = 'Explicit is better than implicit';

    ChatClient.mockImplementation(() => (Object.assign({}, defaultChatClientMock, {
      nickname,

      onReceiveChatMessage: (receivedMessage) => {
        if (deepEqual(receivedMessage, { message, nickname, room })) {
          done();
        }
      },
    })));

    ioClient.connect(new ChatClient());
    ioClient.joinRoom(room);
    ioClient.sendMessageInRoom(message, room);
  });

  test('Socket.io client forwards room announcement', (done) => {
    const newRoom = 'Sauna';

    let expectedCalls = 2;
    const doneIfAllExpectedCallsReceived = () => {
      expectedCalls -= 1;
      if (expectedCalls === 0) {
        done();
      }
    };

    ChatClient.mockImplementation(() => (Object.assign({}, defaultChatClientMock, {
      onNewRoomCreated: (room) => {
        expect(room).toEqual(newRoom);
        doneIfAllExpectedCallsReceived();
      },
      onUpdateRoomList: (rooms) => {
        if (deepEqual(rooms, [newRoom])) {
          doneIfAllExpectedCallsReceived();
        }
      },
    })));

    ioClient.connect(new ChatClient());
    ioClient.joinRoom(newRoom);
  });
});

describe('Socket.io client/server integration tests - error scenarios', () => {
  afterEach((done) => {
    ioClient.close();
    done();
  });

  test('Socket.io yields error message if server down', (done) => {
    ChatClient.mockImplementation(() => (Object.assign({}, defaultChatClientMock, {
      onReceiveSystemMessage: (messageData) => {
        expect(messageData.message).toContain('Error connecting to server');
        done();
      },
    })));
    ioClient = new SocketIoClient(url);
    ioClient.connect(new ChatClient());
  });
});
