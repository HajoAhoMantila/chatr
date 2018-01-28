/* eslint-disable no-unused-vars,max-len */
import express from 'express';
import http from 'http';
import ChatClient from './ChatClient';
import setupSocketIoServer from '../../../server/src/socketioServer';
import SocketIoClient from './SocketIoClient';

jest.mock('./ChatClient');

const testPort = 9000;
const url = `http://localhost:${testPort}/`;
let server;
let ioClient;

describe('Socket.io client/server integration tests - happy path', () => {
  beforeEach((done) => {
    server = http.Server(express());
    setupSocketIoServer(server);
    server.listen(testPort);

    done();
  });

  afterEach((done) => {
    server.close();
    ioClient.close();
    done();
  });

  test('Socket.io client sends and receives message', (done) => {
    ChatClient.mockImplementation(() => ({
      onReceiveChatMessage: (message) => {
        expect(message).toBe(message);
        done();
      },
    }));
    ioClient = new SocketIoClient(url);
    ioClient.connect(new ChatClient());

    ioClient.sendMessage();
  });
});

describe('Socket.io client/server integration tests - error scenarios', () => {
  afterEach((done) => {
    ioClient.close();
    done();
  });

  test('Socket.io yields error message if server down', (done) => {
    ChatClient.mockImplementation(() => ({
      onReceiveSystemMessage: (message) => {
        expect(message).toContain('Error connecting to server');
        done();
      },
    }));
    ioClient = new SocketIoClient(url);
    ioClient.connect(new ChatClient());
  });
});
