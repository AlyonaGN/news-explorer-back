const { generalServerErr } = require('../utils/responsesMessages');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? generalServerErr
        : message,
    });
  next();
};
