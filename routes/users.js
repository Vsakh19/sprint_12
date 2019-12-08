const fs = require('fs');

const path = require('path');

const users = fs.readFileSync(path.join(__dirname, '../data/users.json'), { encoding: 'utf8' });
const router = require('express').Router();

router.get('/users', (req, res) => {
  res.send(users);
});

router.get('/users/:id', (req, res) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < users.length; i++) {
    // eslint-disable-next-line no-underscore-dangle
    if (users[i]._id === req.params.id) {
      res.send(users[i]);
      return;
    }
  }
  res.status(404).json({ message: 'Нет пользователя с таким id' });
});

module.exports = router;
