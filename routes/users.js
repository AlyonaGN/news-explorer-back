const router = require('express').Router();

const {
  getMyUser,
} = require('../controllers/users.js');

router.get('/users/me', getMyUser);

module.exports = router;
