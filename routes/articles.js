const router = require('express').Router();

/* const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  removeLikefromCard,
} = require('../controllers/cards.js'); */
//const { validateMongooseIdInParams, validateCard } = require('../middlewares/validate.js');

router.post('/articles', /* validateCard, */ createArticle);
router.delete('/articles/:id', /* validateMongooseIdInParams, */ deleteArticle);
router.get('/articles', getArticles);

module.exports = router;
