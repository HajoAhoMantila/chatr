import io from 'socket.io-client';
import { ChatEvent } from './shared/eventTypes';
import ExpressServer from './ExpressServer';

const testPort = 9000;
const url = `http://localhost:${testPort}/`;
let server;

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
    const testPayload = { nickname: 'Alice', message: 'test message' };

    client.on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual(testPayload);
      done();
    });

    client.emit(ChatEvent.MESSAGE_FROM_CLIENT, testPayload);
  });

  test('Server broadcasts join if nickname is given when connecting', (done) => {
    client = io(url, { query: { nickname: 'Alice' } });

    client.on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual({ message: 'User Alice joined' });
      done();
    });
  });
});

describe('Client can join chat rooms', () => {
  let client;

  beforeEach(() => {
    client = io(url);
  });

  afterEach(() => {
    client.disconnect();
  });

  test('Server confirms join room', (done) => {
    client.on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual({ room: 'Kitchen', message: 'Alice joined room Kitchen' });
      done();
    });

    client.emit(ChatEvent.JOIN_ROOM, { nickname: 'Alice', room: 'Kitchen' });
  });

  test('Client can send message to room and receives it back', (done) => {
    const testPayload = { nickname: 'Alice', room: 'Kitchen', message: 'Foo' };

    client.on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual(testPayload);
      done();
    });

    client.emit(ChatEvent.JOIN_ROOM, { nickname: 'Alice', room: 'Kitchen' });
    client.emit(ChatEvent.MESSAGE_FROM_CLIENT, testPayload);
  });
});

describe('Socket.io server responds to multiple clients', () => {
  let clientA;
  let clientB;
  let remainingClientsToReceive;

  beforeEach(() => {
    clientA = io(url);
    clientB = io(url);
  });

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

  test('Broadcasts message is received by all clients including sender', (done) => {
    const testData = { nickname: 'Bob', message: 'test message' };
    remainingClientsToReceive = 2;

    clientA.on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual(testData);
      stopIfAllClientsReceived(done);
    });

    clientB.on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual(testData);
      stopIfAllClientsReceived(done);
    });

    clientA.emit(ChatEvent.MESSAGE_FROM_CLIENT, testData);
  });

  test('Message sent to specific room is received by all clients that joined the room', (done) => {
    const testData = { nickname: 'Alice', room: 'Kitchen', message: 'test message' };
    remainingClientsToReceive = 2;

    clientA.on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual(testData);
      stopIfAllClientsReceived(done);
    });

    clientB.on(ChatEvent.MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual(testData);
      stopIfAllClientsReceived(done);
    });

    clientA.emit(ChatEvent.JOIN_ROOM, { nickname: 'Alice', room: 'Kitchen' });
    clientB.emit(ChatEvent.JOIN_ROOM, { nickname: 'Bob', room: 'Kitchen' });
    clientA.emit(ChatEvent.MESSAGE_FROM_CLIENT, testData);
  });

  test('User joining room is announced to all clients that joined the room', (done) => {
    remainingClientsToReceive = 3;

    clientA.on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
      if (remainingClientsToReceive === 3) {
        expect(data).toEqual({ room: 'Kitchen', message: 'Alice joined room Kitchen' });
      } else {
        expect(data).toEqual({ room: 'Kitchen', message: 'Bob joined room Kitchen' });
      }
      stopIfAllClientsReceived(done);
    });

    clientB.on(ChatEvent.SYSTEM_MESSAGE_FROM_SERVER, (data) => {
      expect(data).toEqual({ room: 'Kitchen', message: 'Bob joined room Kitchen' });
      stopIfAllClientsReceived(done);
    });

    clientA.emit(ChatEvent.JOIN_ROOM, { nickname: 'Alice', room: 'Kitchen' });
    clientB.emit(ChatEvent.JOIN_ROOM, { nickname: 'Bob', room: 'Kitchen' });
  });
});

