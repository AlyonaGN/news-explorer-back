const { ObjectId } = require('mongoose').Types;
const { celebrate, Joi } = require('celebrate');

const validateMongooseIdInParams = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().required().custom((value, helpres) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpres.message('Невалидный id');
    }),
  }),
});

const validateSignupBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpres) => {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
        return value;
      }
      return helpres.message('Невалидный email');
    }),
    password: Joi.string().required().trim(),
  }),
});

const validateSigninBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpres) => {
      if (/https?:\/\/(www\.)?([a-zA-Zа-яА-я0-9/_%-])+\.[a-zA-Zа-яА-я0-9/_%-]+#?$/.test(value)) {
        return value;
      }
      return helpres.message('Невалидная ссылка');
    }),
    image: Joi.string().required().custom((value, helpres) => {
      if (/https?:\/\/(www\.)?([a-zA-Zа-яА-я0-9/_%-])+\.[a-zA-Zа-яА-я0-9/_%-]+#?$/.test(value)) {
        return value;
      }
      return helpres.message('Невалидная ссылка');
    }),
  }),
});

module.exports = {
  validateMongooseIdInParams,
  validateSignupBody,
  validateSigninBody,
  validateArticle,
};
