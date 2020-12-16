require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateSignupBody, validateSigninBody } = require('./middlewares/validate.js');
const { limiter } = require('./utils/rateLimiter');

const routes = require('./routes/index.js');
const {
  login,
  createUser,
} = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');
const NotFoundError = require('./errors/not-found-err');
const { mongoDBAdress } = require('./utils/DBadresses');
const { generalNotFoundErr, generalServerErr } = require('./utils/responsesMessages');

const mongoUrl = process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : mongoDBAdress;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.post('/signin', validateSigninBody, login);
app.post('/signup', validateSignupBody, createUser);

app.use(auth);
app.use('/', routes);
app.use(() => {
  throw new NotFoundError(generalNotFoundErr);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? generalServerErr
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`I am listening to PORT ${PORT}`);
});
