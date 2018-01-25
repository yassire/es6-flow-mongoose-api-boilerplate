// @flow

import { Router } from 'express';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import User from '../models/User';

export default class UserRouter {
  // these fields must be type annotated, or Flow will complain!
  router: Router;
  path: string;
  inv: any;

  // take the mount path as the constructor argument
  constructor(apiPath: string = '/api/v1/users') {
    // instantiate the express.Router
    this.router = Router();
    this.path = apiPath;
    // glue it all together
    this.init();
  }

  /**
   * Return all users in the database
   */
  static getAll(req: $Request, res: $Response): void {
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip })
      .then(users => res.status(200).json({ status: 200, data: users }))
      .catch(e => res.status(400).json({ status: 400, message: e.message }));
  }

  /**
   * Return a user by ID.
   */
  static getById(req: $Request, res: $Response): void {
    User.get(req.params.id)
      .then(foundUser => res.json({ status: 200, data: foundUser }))
      .catch(e => res.status(400).json({ status: 400, message: e.message }));
  }

  /**
   * Register a new user
   */
  static postOne(req: $Request, res: $Response): void {
    const newUser = new User(req.body);
    newUser.save()
      .then(savedUser => res.json({ status: 200, data: savedUser }))
      .catch(e => res.status(400).json({ status: 400, message: e.message }));
  }

  /**
   * Update a user by id.
   */
  static updateOneById(req: $Request, res: $Response): void {
    User.get(req.params.id)
      .then((foundUser) => {
        const updatedUser = Object.assign(foundUser, req.body);
        return updatedUser.save()
          .then(savedUser => res.json({ status: 200, data: savedUser }))
          .catch(e => res.status(400).json({ status: 400, message: e.message }));
      })
      .catch(e => res.status(400).json({ status: 400, message: e.message }));
  }

  /**
   * Remove a user by ID.
   */
  static removeById(req: $Request, res: $Response): void {
    User.get(req.params.id)
      .then((foundUser) => {
        foundUser.remove()
          .then(removedUser => res.json({ status: 200, message: `User with email ${removedUser.email} was deleted.` }))
          .catch(e => res.status(400).json({ status: 400, message: e.message }));
      })
      .catch(e => res.status(400).json({ status: 400, message: e.message }));
  }

  /**
   * Attach route handlers to their endpoints.
   */
  init(): void {
    this.router.get('/', UserRouter.getAll);
    this.router.get('/:id', UserRouter.getById);
    this.router.post('/', validate(paramValidation.createUser), UserRouter.postOne);
    this.router.put('/:id', validate(paramValidation.updateUser), UserRouter.updateOneById);
    this.router.delete('/:id', UserRouter.removeById);
  }
}
