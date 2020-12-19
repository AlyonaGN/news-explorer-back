const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthoriszed-err');
const { unauthorisedActionErrMessage } = require('../utils/responsesMessages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(unauthorisedActionErrMessage));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_TOKEN : 'my-secret-key');
  } catch (err) {
    return next(new UnauthorizedError(unauthorisedActionErrMessage));
  }

  req.user = payload;

  return next();
};
