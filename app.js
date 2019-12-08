const express = require('express');


const app = express();
const { PORT = 3000 } = process.env;
const path = require('path');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(express.static(path.join(__dirname, 'public')));
app.use(userRouter);
app.use(cardsRouter);

app.listen(PORT);

app.get('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});
