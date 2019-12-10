const fs = require('fs');

const path = require('path');

const router = require('express').Router();

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/users.json'), (err, data) => {
    if (err) {
      res.json({ message: 'Ошибка чтения файла' });
      return;
    }
    try {
      res.json(JSON.parse(data.toString('utf8')));
    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так' });
    }
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(path.join(__dirname, '../data/users.json'), (err, data) => {
    if (err) {
      res.json({ message: 'Ошибка чтения файла' });
      return;
    }
    try {
      const users = JSON.parse(data.toString('utf8'));
      for (let i = 0; i < users.length; i += 1) {
        // eslint-disable-next-line no-underscore-dangle
        if (users[i]._id === id) {
          res.json(users[i]);
          return;
        }
      }
      res.status(404).json({ message: 'Нет пользователя с таким id' });
    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так' });
    }
  });
});

module.exports = router;
