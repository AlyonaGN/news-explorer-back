module.exports = {
  extends: 'airbnb-base',
  ignorePatterns: ['node_modules', 'public'],
  rules: {
    'no-underscore-dangle': [2, { allow: ['_id'] }],
  },
};
