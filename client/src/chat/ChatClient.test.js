import ChatClient from './ChatClient';
import SocketIoClient from './SocketIoClient';

jest.mock('./SocketIoClient');

let notifyCallback;
let client;
let socketIoClient;

beforeEach(() => {
  notifyCallback = jest.fn();
  socketIoClient = new SocketIoClient();
  client = new ChatClient(notifyCallback, socketIoClient);
});

test('Sets nickname and calls callback', () => {
  client.setNickname('foo');

  expect(notifyCallback).toBeCalledWith(client);
  expect(socketIoClient.connect).toBeCalled();
  expect(client.nickname).toBe('foo');
});

test('Sends message using remote client', () => {
  client.sendMessage('foo');

  expect(socketIoClient.sendMessage).toBeCalledWith('foo');
});

test('Adds received chat message to message list', () => {
  client.onReceiveChatMessage('bar');

  expect(notifyCallback).toBeCalledWith(client);
  expect(client.messages).toContain('bar');
});

test('Adds received system message to message list', () => {
  client.onReceiveSystemMessage('system');

  expect(notifyCallback).toBeCalledWith(client);
  expect(client.messages).toContain('system');
});
