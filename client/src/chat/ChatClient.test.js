import ChatClient from './ChatClient';
import SocketIoClient from './SocketIoClient';

jest.mock('./SocketIoClient');

let callback;
let client;
let socketIoClient;

beforeEach(() => {
  callback = jest.fn();
  client = new ChatClient(callback);
  socketIoClient = new SocketIoClient();
  client.setRemoteClient(socketIoClient);
});

test('Sets nickname and calls callback', () => {
  client.setNickname('foo');

  expect(callback).toBeCalledWith(client);
  expect(client.nickname).toBe('foo');
});

test('Sends message using remote client', () => {
  client.sendMessage('foo');

  expect(socketIoClient.sendMessage).toBeCalledWith('foo');
});

