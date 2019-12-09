const fs = require('fs');

const path = require('path');

const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), { encoding: 'utf8' }));
const router = require('express').Router();

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  for (let i = 0; i < users.length; i += 1) {
    // eslint-disable-next-line no-underscore-dangle
    if (users[i]._id === id) {
      res.json(users[i]);
      return;
    }
  }
  res.status(404).json({ message: 'Нет пользователя с таким id' });
});

module.exports = router;
