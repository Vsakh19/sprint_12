const mongoose = require('mongoose');
const User = require('../models/user').usersModel;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};

module.exports.findUserById = (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findById(id)
      .then((result) => {
        if (result) {
          res.json({ data: result });
        } else {
          res.status(404).json({ message: 'Пользователь не найден' });
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'Произошла ошибка' });
      });
  } else {
    res.status(404).json({ message: 'Некорректный ID' });
  }
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(() => {
      res.status(201).json({ message: 'Пользователь успешно создан' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};
