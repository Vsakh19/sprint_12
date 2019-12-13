const fs = require('fs');

const path = require('path');

const router = require('express').Router();

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/cards.json'), (err, data) => {
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

module.exports = router;
