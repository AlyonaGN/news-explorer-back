const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectInputError = require('../errors/incorrect-input-err');
const UnauthorizedError = require('../errors/unauthoriszed-err');

const getMyUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(new Error('NotFound'))
    .then((userData) => {
      res.send(userData);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new IncorrectInputError('Переданы некорректные данные');
      } else if (error.message === 'NotFound') {
        throw new NotFoundError('Объект не найден');
      }
      throw error;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, { expiresIn: '7d' });
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
};
