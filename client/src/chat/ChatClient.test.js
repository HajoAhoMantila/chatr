import ChatClient, { defaultRoom } from './ChatClient';
import SocketIoClient from './SocketIoClient';

jest.mock('./SocketIoClient');

let notificationCallback;
let client;
let socketIoClient;

beforeEach(() => {
  notificationCallback = jest.fn();
  socketIoClient = new SocketIoClient();
  client = new ChatClient(notificationCallback, socketIoClient);
});

test('When connecting sets nickname, connects with remote and notifies listener', () => {
  client.connectWithNickname('foo');

  expect(socketIoClient.connect).toBeCalled();
  expect(client.nickname).toBe('foo');
  expect(notificationCallback).toBeCalledWith(client);
});

test('When connecting sets default room and adds it to room list', () => {
  client.connectWithNickname('foo');

  expect(client.currentRoom).toBe('Lobby');
  expect(client.rooms).toContain('Lobby');
});

test('Adding a room is idempotent', () => {
  client.addRoomIfNotYetKnown('SomeRoom');
  client.addRoomIfNotYetKnown('SomeRoom');

  expect(client.rooms).toContain('SomeRoom');
  expect(client.rooms.count()).toEqual(1);
});

test('Adding an existing room does not reset messages', () => {
  const room = 'SomeRoom';
  client.addRoomIfNotYetKnown(room);
  client.addMessageDataToRoom({ room, message: 'foo' });
  client.addRoomIfNotYetKnown(room);

  expect(client.messages[room].count()).toEqual(1);
});

test('Sends message using remote client', () => {
  client.connectWithNickname('Alice');
  client.sendMessage('foo');

  expect(socketIoClient.sendMessage).toBeCalledWith('foo');
});

test('Adds received chat message for default room to message list', () => {
  const messageData = { nickname: 'Bob', message: 'foo' };

  client.connectWithNickname('Alice');
  client.onReceiveChatMessage(messageData);

  expect(client.messages[defaultRoom]).toContainEqual(messageData);
  expect(notificationCallback).toBeCalledWith(client);
});

test('Adds received system message for default room to message list', () => {
  client.connectWithNickname('Alice');
  client.onReceiveSystemMessage({ message: 'errormessage' });

  expect(notificationCallback).toBeCalledWith(client);
  const expectedMessageData = { nickname: 'System', message: 'errormessage' };
  expect(client.messages[defaultRoom]).toContainEqual(expectedMessageData);
});

test('When receiving first system message in room: adds room, saves message and notifies', () => {
  const message = 'Somebody joined';
  const room = 'Ballroom';

  client.onReceiveSystemMessage({ message, room });

  expect(client.rooms).toContain(room);
  expect(client.messages[room]).toContainEqual({ nickname: 'System', message, room });
  expect(notificationCallback).toBeCalledWith(client);
});

test('When receiving first chat message in room: adds room, saves message and notifies', () => {
  const message = 'Hi there';
  const room = 'Ballroom';
  const nickname = 'Chuck';
  client.onReceiveChatMessage({ message, room, nickname });

  expect(client.rooms).toContainEqual(room);
  expect(client.messages[room]).toContainEqual({ nickname, message, room });
  expect(notificationCallback).toBeCalledWith(client);
});
