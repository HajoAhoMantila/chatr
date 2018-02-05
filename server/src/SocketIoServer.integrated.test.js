import io from 'socket.io-client';
import deepEqual from 'deep-equal';
import { List } from 'immutable';
import ExpressServer from './ExpressServer';
import { ChatEvent } from './shared/eventTypes';

const testPort = 9000;
const url = `http://localhost:${testPort}/`;
let server;

const ROOM_1 = 'Kitchen';
const ROOM_2 = 'Living Room';
const USER_A = 'Alice';
const USER_B = 'Bob';
const MESSAGE_USER_A_JOINED = 'User Alice joined';
const MESSAGE_USER_B_JOINED = 'User Bob joined';
const MESSAGE_USER_A_JOINED_ROOM = 'Alice joined room Kitchen';
const MESSAGE_USER_B_JOINED_ROOM = 'Bob joined room Kitchen';

beforeEach((done) => {
  server = new ExpressServer(testPort);
  server.start();
  done();
});

afterEach((done) => {
  server.stop();
  done();
});

describe('Socket.IO Server responds to a single client', () => {
  let client;

  afterEach(() => {
    client.disconnect();
  });

  test('Server sends chat message back to client', (done) => {
    client = io(url);
    const testPayload = { nickname: USER_A, message: 'test message' };

    client.on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual(testPayload);
      done();
    });

    client.emit(ChatEvent.MESSAGE_FROM_CLIENT, testPayload);
  });

  test('Server broadcasts join if nickname is given when connecting', (done) => {
    client = io(url, { query: { nickname: USER_A } });

    client.on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual({ message: MESSAGE_USER_A_JOINED });
      done();
    });
  });

  test('Server broadcasts user joining room', (done) => {
    client = io(url)
      .on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
        expect(data).toEqual({ room: ROOM_1, message: MESSAGE_USER_A_JOINED_ROOM });
        done();
      });

    client.emit(ChatEvent.JOIN_ROOM, { nickname: USER_A, room: ROOM_1 });
  });

  test('Client can send message to room and receives it back', (done) => {
    const testPayload = { nickname: USER_A, room: ROOM_1, message: 'Foo' };

    client = io(url)
      .on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
        expect(data).toEqual(testPayload);
        done();
      });

    client.emit(ChatEvent.JOIN_ROOM, { nickname: USER_A, room: ROOM_1 });
    client.emit(ChatEvent.MESSAGE_FROM_CLIENT, testPayload);
  });
});

describe('Socket.io server responds to multiple clients', () => {
  let clientA;
  let clientB;
  let remainingClientsToReceive;

  afterEach(() => {
    clientA.disconnect();
    clientB.disconnect();
  });

  function stopIfAllClientsReceived(done) {
    remainingClientsToReceive -= 1;
    if (remainingClientsToReceive === 0) {
      done();
    }
  }

  test('Broadcasts chat message is received by all clients including sender', (done) => {
    const testData = { nickname: USER_B, message: 'test message' };
    remainingClientsToReceive = 2;

    clientA = io(url)
      .on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
        expect(data).toEqual(testData);
        stopIfAllClientsReceived(done);
      });

    clientB = io(url)
      .on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
        expect(data).toEqual(testData);
        stopIfAllClientsReceived(done);
      });

    clientA.emit(ChatEvent.MESSAGE_FROM_CLIENT, testData);
  });

  test('User join message is received by all users in default room', (done) => {
    remainingClientsToReceive = 2;
    const userBJoinedMessage = { message: MESSAGE_USER_B_JOINED };

    clientA = io(url, { query: { nickname: USER_A } })
      .on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
        if (deepEqual(data, userBJoinedMessage)) {
          stopIfAllClientsReceived(done);
        }
      });

    clientB = io(url, { query: { nickname: USER_B } })
      .on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
        if (deepEqual(data, userBJoinedMessage)) {
          stopIfAllClientsReceived(done);
        }
      });
  });

  test('User joining room is announced to all clients that joined the room', (done) => {
    remainingClientsToReceive = 3;

    clientA =
      io(url).on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
        if (remainingClientsToReceive === 3) {
          expect(data).toEqual({ room: ROOM_1, message: MESSAGE_USER_A_JOINED_ROOM });
        } else {
          expect(data).toEqual({ room: ROOM_1, message: MESSAGE_USER_B_JOINED_ROOM });
        }
        stopIfAllClientsReceived(done);
      });

    clientB = io(url)
      .on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
        expect(data).toEqual({ room: ROOM_1, message: MESSAGE_USER_B_JOINED_ROOM });
        stopIfAllClientsReceived(done);
      });

    clientA.emit(ChatEvent.JOIN_ROOM, { nickname: USER_A, room: ROOM_1 });
    clientB.emit(ChatEvent.JOIN_ROOM, { nickname: USER_B, room: ROOM_1 });
  });

  test('Message sent to specific room is received by all clients that joined the room', (done) => {
    const testData = { nickname: USER_A, room: ROOM_1, message: 'test message' };
    remainingClientsToReceive = 2;

    clientA = io(url)
      .on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
        expect(data).toEqual(testData);
        stopIfAllClientsReceived(done);
      });

    clientB = io(url)
      .on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
        expect(data).toEqual(testData);
        stopIfAllClientsReceived(done);
      });

    clientA.emit(ChatEvent.JOIN_ROOM, { nickname: USER_A, room: ROOM_1 });
    clientB.emit(ChatEvent.JOIN_ROOM, { nickname: USER_B, room: ROOM_1 });
    clientA.emit(ChatEvent.MESSAGE_FROM_CLIENT, testData);
  });

  test('Client is informed about existing rooms when joining', (done) => {
    server.socketIoServer.rooms = new List([ROOM_1, ROOM_2]);

    clientB = io(url)
      .on(ChatEvent.ANNOUNCE_ROOMS, (data) => {
        expect(data).toEqual({ rooms: [ROOM_1, ROOM_2] });
        done();
      });
  });

  test('New rooms are announced to all clients', (done) => {
    const expectedData = { newRoom: ROOM_1, rooms: [ROOM_1] };
    remainingClientsToReceive = 2;

    clientA = io(url)
      .on(ChatEvent.ANNOUNCE_ROOMS, (data) => {
        if (deepEqual(data, expectedData)) {
          stopIfAllClientsReceived(done);
        }
      });

    clientB = io(url)
      .on(ChatEvent.ANNOUNCE_ROOMS, (data) => {
        if (deepEqual(data, expectedData)) {
          stopIfAllClientsReceived(done);
        }
      });

    clientA.emit(ChatEvent.JOIN_ROOM, { nickname: USER_A, room: ROOM_1 });
  });
});

