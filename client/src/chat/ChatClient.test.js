import ChatClient, { DEFAULT_ROOM, MessageType } from './ChatClient';
import SocketIoClient from './SocketIoClient';

jest.mock('./SocketIoClient');

let notificationCallback;
let client;
let socketIoClient;

// FIXME: organize tests

beforeEach(() => {
  notificationCallback = jest.fn();
  socketIoClient = new SocketIoClient();
  client = new ChatClient(notificationCallback, socketIoClient);
});

test('Adding a message creates message list for room and saves message', () => {
  const room = 'Room';
  const message = { room, message: 'Message' };
  client.addMessageToRoom(message);

  expect(client.rooms).toContain(room);
  expect(client.messages[room]).toContain(message);
});

test('Adding multiple messages to a room works', () => {
  const room = 'Room';
  const messageA = { room, message: 'MessageA' };
  const messageB = { room, message: 'MessageB' };
  client.addMessageToRoom(messageA);
  client.addMessageToRoom(messageB);

  expect(client.messages[room]).toContain(messageA);
  expect(client.messages[room]).toContain(messageB);
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

test('Sends message using remote client', () => {
  client.connectWithNickname('Alice');
  client.sendMessage('foo');

  expect(socketIoClient.sendMessageInRoom).toBeCalledWith('foo', client.currentRoom);
});

test('Adds received chat message for default room to message list', () => {
  const messageData = { nickname: 'Bob', message: 'foo' };

  client.connectWithNickname('Alice');
  client.onReceiveChatMessage(messageData);

  expect(client.messages[DEFAULT_ROOM]).toContainEqual(messageData);
  expect(notificationCallback).toBeCalledWith(client);
});

test('Adds received system message for default room to message list', () => {
  client.connectWithNickname('Alice');
  client.onReceiveSystemMessage({ message: 'errormessage' });

  expect(notificationCallback).toBeCalledWith(client);
  const expectedMessageData = { nickname: 'System', type: MessageType.SYSTEM_MESSAGE, message: 'errormessage' };
  expect(client.messages[DEFAULT_ROOM]).toContainEqual(expectedMessageData);
});

test('When receiving first system message in room: adds room, saves message and notifies', () => {
  const message = 'Somebody joined';
  const room = 'Ballroom';

  client.onReceiveSystemMessage({ message, room });

  expect(client.rooms).toContain(room);
  expect(client.messages[room]).toContainEqual({
    nickname: 'System', type: MessageType.SYSTEM_MESSAGE, message, room,
  });
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

test('Joining a room is idempotent', () => {
  client.joinRoom('SomeRoom');
  client.joinRoom('SomeRoom');

  expect(client.rooms).toContain('SomeRoom');
  expect(client.rooms.count()).toEqual(1);
});

test('Joining an existing room does not reset messages', () => {
  const room = 'SomeRoom';
  client.joinRoom(room);
  client.addMessageToRoom({ room, message: 'foo' });
  client.joinRoom(room);

  expect(client.messages[room].count()).toEqual(1);
});

test('Adds and joins room using remote client', () => {
  const room = 'Ballroom';
  client.joinRoom(room);

  expect(client.rooms).toContainEqual(room);
  expect(client.joinedRooms).toContainEqual(room);
  expect(client.currentRoom).toEqual(room);
  expect(socketIoClient.joinRoom).toBeCalledWith(room);
  expect(notificationCallback).toBeCalledWith(client);
});

test('Does not join using remote client when already joined a room', () => {
  const room = DEFAULT_ROOM;
  client.joinRoom(room);

  expect(client.rooms).toContainEqual(room);
  expect(client.currentRoom).toEqual(room);
  expect(socketIoClient.joinRoom).not.toBeCalled();
  expect(notificationCallback).toBeCalledWith(client);
});

test('Given a known room not yet joined, joins using remote client', () => {
  const room = 'RoomA';
  client.onUpdateRoomList([room, 'RoomB']);
  client.joinRoom(room);

  expect(client.rooms).toContainEqual(room);
  expect(client.joinedRooms).toContainEqual(room);
  expect(client.currentRoom).toEqual(room);
  expect(socketIoClient.joinRoom).toBeCalledWith(room);
  expect(notificationCallback).toBeCalledWith(client);
});


test('Adds system message to default room when new room created & notifies', () => {
  const expectedMessage = {
    message: "A new room 'Sauna' was created",
    nickname: 'System',
    type: 'System',
  };
  const room = 'Sauna';

  client.onNewRoomCreated(room);

  expect(client.messages[DEFAULT_ROOM]).toContainEqual(expectedMessage);
  expect(notificationCallback).toBeCalledWith(client);
});

test('Updates room list & notifies', () => {
  client.onUpdateRoomList(['More', 'Less']);

  expect(client.rooms).toContainEqual('More');
  expect(client.rooms).toContainEqual('Less');
  expect(notificationCallback).toBeCalledWith(client);
});

test('When updating room list keeps default room', () => {
  client.onUpdateRoomList(['More', 'Less']);

  expect(client.rooms).toContainEqual(DEFAULT_ROOM);
});

test('When user joins user is announced in default room', () => {
  const joiningUser = 'James';
  client.onUserJoinsChat(joiningUser);

  expect(client.messages[DEFAULT_ROOM]).toContainEqual({
    message: `${joiningUser} joined`,
    nickname: 'System',
    type: 'System',
  });
  expect(notificationCallback).toBeCalledWith(client);
});

test('When user joins room user is announced in room', () => {
  const joiningUser = 'George';
  const room = 'Stage';
  client.addRoomToRoomsJoined(room);
  client.onUserJoinsRoom(joiningUser, room);

  expect(client.messages[room]).toContainEqual({
    message: `${joiningUser} joined room ${room}`,
    room,
    nickname: 'System',
    type: 'System',
  });
  expect(notificationCallback).toBeCalledWith(client);
});

