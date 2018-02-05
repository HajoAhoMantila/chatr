import { Set } from 'immutable';
import SocketIoServer from './SocketIoServer';

test('Announce room only if not yet announced', () => {
  const room = 'Lobby';
  const ioServer = new SocketIoServer();
  ioServer.rooms = new Set([room]);
  ioServer.broadcastToAllInDefaultRoom = jest.fn();

  ioServer.addAndAnnounceRoom(room);
  expect(ioServer.broadcastToAllInDefaultRoom).not.toBeCalled();
});

