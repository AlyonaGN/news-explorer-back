const router = require('express').Router();

const {
  getMyUser,
} = require('../controllers/users.js');
//const { validateAvatar, validateToken, validateUpdatesToProfile } = require('../middlewares/validate.js');

router.get('/users/me', /* validateToken, */ getMyUser);

module.exports = router;
