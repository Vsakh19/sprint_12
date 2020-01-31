const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const errors = require('./middlewares/errors');
const {celebrate, Joi} = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');



const app = express();
const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.log(`Ошибка подключения к бд: ${err.toString()}`);
  });

app.use(requestLogger);
app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email:Joi.string().required().email(),
    password: Joi.string().required().password(),
    about: Joi.string().required(),
    avatar: Joi.string().required()
  })
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    password: Joi.string().required().password(),
  })
}), login);
app.use(errorLogger);
app.use(errors());
app.use(errors);

app.listen(PORT);

app.get('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});
