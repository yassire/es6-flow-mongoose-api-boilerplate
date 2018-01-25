// @flow
import faker from 'faker';
import User from '../models/User';

function generateUser(): User {
  return new User({
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  });
}

export {
  generateUser as default,
};
