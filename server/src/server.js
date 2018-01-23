import createExpressServer from './expressServer';

const server = createExpressServer();
const port = (process.env.PORT || 3001);
server.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
