// @flow

import { Router } from 'express';
import validate from 'express-validation';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import paramValidation from '../config/param-validation';
import User from '../models/User';
import config from '../config';

export default class AuthRouter {
  // these fields must be type annotated, or Flow will complain!
  router: Router;
  path: string;

  // take the mount path as the constructor argument
  constructor(apiPath: string = '/api/v1/auth') {
    // instantiate the express.Router
    this.router = Router();
    this.path = apiPath;
    // glue it all together
    this.init();
  }

  /**
   * Authenticate a user
   */
  static login(req: $Request, res: $Response): void {
    User.getByEmail(req.body.email)
      .then((foundUser) => {
        if (req.body.email === foundUser.email && req.body.password === foundUser.password) {
          const token = jwt.sign({
            email: foundUser.email,
          }, config.jwtSecret);
          return res.status(200).json({
            status: 200,
            data: {
              token,
              email: foundUser.email,
            },
          });
        }
        return res.status(401).json({ status: 401, message: 'Invalid credentials supplied' });
      })
      .catch(e => res.status(400).json({ status: 400, message: e.message }));
  }

  /**
   *
   * A protected call
   */
  static protected(req: $Request, res: $Response): void {
    return res.status(200).json({ status: 200, message: 'Successfully authenticated' });
  }


  /**
   * Attach route handlers to their endpoints.
   */
  init(): void {
    this.router.post('/login', validate(paramValidation.login), AuthRouter.login);
    this.router.get('/protected', expressJwt({ secret: config.jwtSecret }), AuthRouter.protected);
  }
}
