const express = require('express');
const userRoutes = require('./users.js');
const articlesRoutes = require('./articles.js');

const { validateSignupBody, validateSigninBody } = require('../middlewares/validate.js');
const {
  login,
  createUser,
} = require('../controllers/users.js');
const auth = require('../middlewares/auth.js');

const router = express.Router();

router.post('/signin', validateSigninBody, login);
router.post('/signup', validateSignupBody, createUser);
router.use(auth);
router.use(userRoutes);
router.use(articlesRoutes);

module.exports = router;
