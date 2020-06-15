import { env } from './config/global';
import { Server } from './server';
import "reflect-metadata";
import { createServer } from 'http';
import {createConnection} from "typeorm";
import { logger } from './config/logger';

createConnection()
  .then(() => {

    // Init express server
    const app = new Server().app;
    const server = createServer(app);

    // Start express server
    server.listen(env.NODE_PORT);

    server.on('listening', () => {
        logger.info( `PRODEFI-OBSERVER-NODE server is listening on port ${env.NODE_PORT} in ${env.NODE_ENV} mode`)
    });

    server.on('close', () => {
      logger.info('Server closed');
    });
  })
  .catch(err => {
    console.log(err);
  })
