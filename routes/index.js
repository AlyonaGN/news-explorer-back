const express = require('express');
const userRoutes = require('./users.js');
const articlesRoutes = require('./articles.js');

const router = express.Router();

router.use(userRoutes);
router.use(articlesRoutes);

module.exports = router;
