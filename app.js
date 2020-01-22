const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {createUser, login} = require('./controllers/users');


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

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.post('/signup', createUser);
app.post('/signin', login);

app.listen(PORT);

app.get('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});
