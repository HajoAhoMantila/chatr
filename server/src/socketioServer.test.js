import io from 'socket.io-client';
import createServer from './expressServer';

const testPort = 9000;
const url = `http://localhost:${testPort}/`;
let server;

beforeEach((done) => {
  server = createServer();
  server.listen(testPort);
  done();
});

afterEach((done) => {
  server.close();
  done();
});

describe('Socket.IO Server responds to a single client', () => {
  let client;

  beforeEach(() => {
    client = io(url);
  });

  afterEach(() => {
    client.disconnect();
  });

  test('Server sends chat message back to client', (done) => {
    client.on('messageFromServer', (data) => {
      expect(data.message).toBe('test message');
      done();
    });

    client.emit('messageFromClient', { message: 'test message' });
  });
});

describe('Socket.io server responds to multiple clients', () => {
  let clientA;
  let clientB;

  beforeEach(() => {
    clientA = io(url);
    clientB = io(url);
  });

  afterEach(() => {
    clientA.disconnect();
    clientB.disconnect();
  });

  test('Socket.IO Server broadcasts message to sender and one other client', (done) => {
    let remainingClientsToReceive = 2;
    const testData = { message: 'test message' };

    function stopIfAllClientsReceived() {
      remainingClientsToReceive -= 1;
      if (remainingClientsToReceive === 0) {
        done();
      }
    }

    clientA.on('messageFromServer', (data) => {
      expect(data).toEqual(testData);
      stopIfAllClientsReceived();
    });

    clientB.on('messageFromServer', (data) => {
      expect(data).toEqual(testData);
      stopIfAllClientsReceived();
    });

    clientA.emit('messageFromClient', testData);
  });
});

