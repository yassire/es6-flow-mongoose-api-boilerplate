// @flow


import mongoose from 'mongoose';
import util from 'util';
import * as http from 'http';
import debug from 'debug';
import Api from './Api';
import config from './config';

// ErrnoError interface for use in onError
declare interface ErrnoError extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
}

// constants
const logger = debug('api-boilerplate:startup');
const app: Api = new Api();
const DEFAULT_PORT: number = 3000;

// functions
function normalizePort(val: any): number | string {
  const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;

  if (port && port >= 0) return port;
  return DEFAULT_PORT;
}

const port: string | number = normalizePort(process.env.PORT);
const server: http.Server = http.createServer(app.express);
// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

function onError(error: ErrnoError): void {
  if (error.syscall !== 'listen') throw error;
  const bind: string = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port.toString()}`;

  switch (error.code) {
    case 'EACCES':
      logger(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr: string = server.address();
  const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  logger(`Listening on ${bind}`);
}

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName: string, method: string, query: string, doc: string) => {
    logger(`${collectionName}.${method}`, util.inspect(query, { showHidden: false, depth: 20 }), doc);
  });
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
