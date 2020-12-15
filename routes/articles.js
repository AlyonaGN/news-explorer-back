const router = require('express').Router();

const {
  createArticle,
  getArticles,
  deleteArticle,
} = require('../controllers/articles.js');
const { validateMongooseIdInParams, validateArticle } = require('../middlewares/validate.js');

router.post('/articles', validateArticle, createArticle);
router.delete('/articles/:id', validateMongooseIdInParams, deleteArticle);
router.get('/articles', getArticles);

module.exports = router;
