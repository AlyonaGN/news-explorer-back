class IncorrectInputError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'IncorrectInputError';
  }
}

module.exports = IncorrectInputError;
