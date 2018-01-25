// @flow

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} has already been registered',
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, Error>}
     */
  get(id: string) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        return Promise.reject(new Error(`User not found with id ${id}`));
      })
      .catch(e => Promise.reject(new Error(e.message)));
  },

  /**
     * Get user by email
     * @param {String} email - The email of user.
     * @returns {Promise<User, Error>}
     */
  getByEmail(email: string) {
    return this.findOne({ email }).exec().then((user) => {
      if (user) {
        return user;
      }
      return Promise.reject(new Error(`User not found with email ${email}`));
    });
  },

  /**
     * Get user by email or id
     * @param {String} email - The email of user.
     * @param {String} id - The id of user.
     * @returns {Promise<User, Error>}
     */
  getByIdOrEmail(id: string, email: string) {
    if (id) {
      return this.get(id);
    }
    return this.getByEmail(email);
  },

  /**
     * List a limit of 50 users
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
  list(keyword: string, { skip = 0, limit = 50 } = {}) {
    return this.find()
      .skip(skip)
      .limit(limit)
      .exec();
  },
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
