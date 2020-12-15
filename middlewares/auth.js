const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthoriszed-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return Promise.reject(new UnauthorizedError('Необходима авторизация'))
      .catch(next);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    return Promise.reject(new UnauthorizedError('Необходима авторизация'))
      .catch(next);
  }

  req.user = payload;

  return next();
};
