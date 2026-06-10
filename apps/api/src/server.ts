import http from 'node:http';
import { buildApp } from './app/app';
import { env } from './config/env';
import { logger } from './config/logger';
import { attachSockets } from './modules/multiplayer/sockets';

const app = buildApp();
const server = http.createServer(app);
attachSockets(server);

server.listen(env.PORT, () => {
  logger.info(`PASSWORD MASTER API ready on http://localhost:${env.PORT}/api/v1`);
});
