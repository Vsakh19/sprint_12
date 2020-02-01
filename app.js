require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const {celebrate, Joi, errors} = require('celebrate');
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
    password: Joi.string().required(),
    about: Joi.string().required(),
    avatar: Joi.string().required()
  })
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    password: Joi.string().required(),
  })
}), login);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт'); 
  }, 0);
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) =>{
  const {statusCode = 500, message} = err;
  res.status(statusCode).send({message: message});
});

app.listen(PORT);

app.get('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});
