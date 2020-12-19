const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectInputError = require('../errors/incorrect-input-err');
const UnauthorizedError = require('../errors/unauthoriszed-err');
const ConflictError = require('../errors/conflict-err');
const { incorrectDataErrMessage, userNotFoundErrMessage, doubleRegistrationErrMessage } = require('../utils/responsesMessages');

const getMyUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(new NotFoundError(userNotFoundErrMessage))
    .then((userData) => {
      res.send(userData);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new IncorrectInputError(incorrectDataErrMessage);
      }
      throw error;
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    password, name,
  } = req.body;

  const userEmail = req.body.email;

  return User.findOne({ email: userEmail })
    .then((user) => {
      if (user) {
        throw new ConflictError(doubleRegistrationErrMessage);
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, email: userEmail, password: hash,
          })
            .then(({ email, _id }) => {
              res.send({ email, _id });
            });
        });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new IncorrectInputError(incorrectDataErrMessage);
      }
      throw error;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_TOKEN : 'my-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next);
};

module.exports = {
  getMyUser,
  login,
  createUser,
};
