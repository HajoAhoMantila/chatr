/* eslint-disable no-unused-vars,max-len */
import express from 'express';
import http from 'http';
import ChatClient from './ChatClient';
import SocketIoClient from './SocketIoClient';
import SocketIoServer from '../../../server/src/SocketIoServer';

jest.mock('./ChatClient');

const testPort = 9000;
const url = `http://localhost:${testPort}/`;
let server;
let ioClient;
let ioServer;

describe('Socket.io client/server integration tests - happy path', () => {
  beforeEach((done) => {
    server = http.Server(express());
    ioServer = new SocketIoServer(server);
    ioServer.start();
    server.listen(testPort);
    done();
  });

  afterEach((done) => {
    ioClient.close();
    ioServer.close();
    server.close();
    done();
  });

  test('Socket.io client connects and receives join message', (done) => {
    ChatClient.mockImplementation(() => ({
      get nickname() {
        return 'Alice';
      },

      onReceiveSystemMessage: (message) => {
        expect(message).toEqual({ message: 'User Alice joined' });
        done();
      },
    }));

    ioClient = new SocketIoClient(url);
    ioClient.connect(new ChatClient());
  });

  test('Socket.io client sends and receives message', (done) => {
    const testMessage = { foobar: 'foobar' };
    ChatClient.mockImplementation(() => ({
      onReceiveChatMessage: (message) => {
        expect(message).toEqual(testMessage);
        done();
      },
    }));
    ioClient = new SocketIoClient(url);
    ioClient.connect(new ChatClient());

    ioClient.sendMessage(testMessage);
  });
});

describe('Socket.io client/server integration tests - error scenarios', () => {
  afterEach((done) => {
    ioClient.close();
    done();
  });

  test('Socket.io yields error message if server down', (done) => {
    ChatClient.mockImplementation(() => ({
      onReceiveSystemMessage: (messageData) => {
        expect(messageData.message).toContain('Error connecting to server');
        done();
      },
    }));
    ioClient = new SocketIoClient(url);
    ioClient.connect(new ChatClient());
  });
});
