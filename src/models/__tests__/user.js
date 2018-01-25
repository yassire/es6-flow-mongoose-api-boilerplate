// @flow

import mongoose from 'mongoose';
import User from '../User';
import generateUser from '../../helpers/utils';

describe('Test the User model', () => {
  let user: User;
  beforeAll(() => {
    mongoose.connect('mongodb://localhost/flow-node-api-test');
  });
  beforeEach(() => {
    user = new User(generateUser());
    return user.save();
  });
  afterEach(() => User.remove({}));
  afterAll((done) => {
    mongoose.disconnect(done);
  });

  test('Should return a result when match', async () => {
    const result = await User.get(user.id);
    expect(result.id).toEqual(user.id);
    expect(result.email).toEqual(user.email);
    expect(result.firstname).toEqual(user.firstname);
  });

  test('Should find a user by email', async () => {
    const result = await User.getByEmail(user.email);
    expect(result.id).toEqual(user.id);
    expect(result.email).toEqual(user.email);
    expect(result.firstname).toEqual(user.firstname);
  });

  test('Should find a user by id or email - id', async () => {
    const result = await User.getByIdOrEmail(user.id, user.email);
    expect(result.id).toEqual(user.id);
    expect(result.email).toEqual(user.email);
    expect(result.firstname).toEqual(user.firstname);
  });

  test('Should find a user by id or email - email', async () => {
    const result = await User.getByIdOrEmail(null, user.email);
    expect(result.id).toEqual(user.id);
    expect(result.email).toEqual(user.email);
    expect(result.firstname).toEqual(user.firstname);
  });

  test('Should return error if no user found', async () => {
    try {
      await User.get('5a65dd343da01532bc2b60bd');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.message).toEqual('User not found with id 5a65dd343da01532bc2b60bd');
    }
  });

  test('Should return error if email not found', async () => {
    try {
      await User.getByEmail('fake@example.com');
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.message).toEqual('User not found with email fake@example.com');
    }
  });
});

test('create empty user', () => {
  const newUser = new User();
  const userJSON = newUser.toJSON();
  const expected = {
    _id: expect.any(mongoose.Types.ObjectId),
  };
  expect(userJSON).toEqual(expected);
});

test('generate user json', () => {
  const newUser = generateUser();
  const userJSON = newUser.toJSON();
  const expected = {
    _id: expect.any(mongoose.Types.ObjectId),
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    password: newUser.password,
    email: newUser.email,
  };
  expect(userJSON).toEqual(expected);
});
