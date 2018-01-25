// @flow

import Joi from 'joi';

export default {
  // POST /users
  createUser: {
    body: {
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  },

  // PUT /users/:userId
  updateUser: {
    params: {
      userId: Joi.string().hex().required(),
    },
  },

  // POST /login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
};
