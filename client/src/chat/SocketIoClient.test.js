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
    setRemoteClient: () => {},
    onReceiveMessage: (message) => {
      expect(message).toBe(message);
      done();
    },
  }));
  ioClient = new SocketIoClient(new ChatClient(), url);
  ioClient.sendMessage();
});

