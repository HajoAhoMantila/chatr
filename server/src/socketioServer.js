import SocketIO from 'socket.io';

function onMessageFromClient(socket, data) {
  socket.broadcast.emit('messageFromServer', data);
  socket.emit('messageFromServer', data);
}

export default function setupSocketIoServer(httpServer) {
  const io = new SocketIO(httpServer);

  io.on('connection', (socket) => {
    socket.on('messageFromClient', (data) => {
      onMessageFromClient(socket, data);
    });
  });
}
