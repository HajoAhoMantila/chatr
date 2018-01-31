import express from 'express';
import http from 'http';
import path from 'path';
import SocketIoServer from './SocketIoServer';

export default class ExpressServer {
  constructor(port) {
    this.port = port;
    this.httpServer = undefined;
    this.socketIoServer = undefined;
  }

  start() {
    this.initializeExpressServer();
    this.initializeSocketIoServer();

    this.httpServer.listen(this.port, () => {
      console.log(`Listening on *:${this.port}`);
    });
  }

  stop() {
    this.socketIoServer.close();
    this.httpServer.close();
  }

  initializeExpressServer() {
    const app = express();
    this.httpServer = http.Server(app);

    const staticFiles = express.static(path.join(__dirname, '../../client/build'));
    app.use(staticFiles);
  }

  initializeSocketIoServer() {
    this.socketIoServer = new SocketIoServer(this.httpServer);
    this.socketIoServer.start();
  }
}

