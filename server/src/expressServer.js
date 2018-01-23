import express from 'express';
import http from 'http';
import setupSocketIoServer from './socketioServer';

export default function createExpressServer() {
  const app = express();
  const httpServer = http.Server(app);

  setupSocketIoServer(httpServer);
  return httpServer;
}

