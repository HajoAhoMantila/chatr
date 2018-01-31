import ExpressServer from './ExpressServer';

const port = (process.env.PORT || 3001);

const server = new ExpressServer(port);
server.start();

