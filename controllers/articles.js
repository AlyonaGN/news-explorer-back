const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const IncorrectInputError = require('../errors/incorrect-input-err');
const ForbiddenError = require('../errors/forbidden-err');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .populate('owner')
    .then((newArticle) => {
      res.send(newArticle);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new IncorrectInputError('Переданы некорректные данные');
      }
      throw error;
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      res.send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { id } = req.params;
  Article.findById(id)
    .orFail(new Error('NotFound'))
    .then((article) => {
      const articleOwner = article.owner.toString();
      if (req.user._id !== articleOwner) {
        throw new ForbiddenError('Невозможно удалить карточку другого пользователя');
      }

      Article.deleteOne({ _id: id })
        .orFail(new Error('Карточка не найдена'))
        .then((deletedArticle) => res.send(deletedArticle))
        .catch((error) => {
          if (error.name === 'CastError') {
            throw new IncorrectInputError('Переданы некорректные данные');
          } else if (error.message === 'NotFound') {
            throw new NotFoundError('Не удалось найти и удалить карточку');
          }
          throw error(error.message);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new IncorrectInputError('Переданы некорректные данные');
      } else if (error.message === 'NotFound') {
        throw new NotFoundError('Не удалось найти и удалить карточку');
      }
      throw error;
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createArticle,
  getArticles,
  deleteArticle,
};
