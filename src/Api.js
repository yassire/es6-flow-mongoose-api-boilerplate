// @flow

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import expressValidation from 'express-validation';
import UserRouter from './routers/UserRouter';
import AuthRouter from './routers/AuthRouter';

export default class Api {
  // annotate with the express $Application type
  express: express$Application;

  // create the express instance, attach app-level middleware, attach routers
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.validations();
  }

  // register middlewares
  middleware(): void {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // connect resource routers
  routes(): void {
    const userRouter = new UserRouter();
    const authRouter = new AuthRouter();
    this.express.use(userRouter.path, userRouter.router);
    this.express.use(authRouter.path, authRouter.router);
  }

  // joi validations
  validations(): void {
    this.express.use((err: Error, req: $Request, res: $Response, next: any) => {
      if (err instanceof expressValidation.ValidationError) {
        const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        res.status(400).json({
          status: 400,
          message: unifiedErrorMessage,
        });
        return next();
      }
      res.status(400).json({
        status: 400,
        message: err.message,
      });
      return next();
    });
  }
}
