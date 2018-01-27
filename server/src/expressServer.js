import express from 'express';
import http from 'http';
import path from 'path';
import setupSocketIoServer from './socketioServer';

export default function createExpressServer() {
  const app = express();
  const httpServer = http.Server(app);

  const staticFiles = express.static(path.join(__dirname, '../../client/build'));
  app.use(staticFiles);

  const jGivenReport = express.static(path.join(__dirname, '../../functional_tests/jGiven-report'));
  app.use('/jgiven', jGivenReport);

  setupSocketIoServer(httpServer);
  return httpServer;
}
