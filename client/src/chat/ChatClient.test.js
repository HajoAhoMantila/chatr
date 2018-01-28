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
  client.setNickname('Alice');
  client.sendMessage('foo');

  expect(socketIoClient.sendMessage).toBeCalledWith({ nickname: 'Alice', message: 'foo' });
});

test('Adds received chat message to message list', () => {
  const messageData = { nickname: 'Alice', message: 'foo' };
  client.onReceiveChatMessage(messageData);

  expect(notifyCallback).toBeCalledWith(client);
  expect(client.messages).toContainEqual(messageData);
});

test('Adds received system message to message list', () => {
  client.onReceiveSystemMessage('errormessage');

  expect(notifyCallback).toBeCalledWith(client);
  const expectedMessageData = { nickname: 'System', message: 'errormessage' };
  expect(client.messages).toContainEqual(expectedMessageData);
});
