const User = require('../models/user').usersModel;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((result) => {
      res.json({ users: result });
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};

module.exports.findUserById = (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.json({ data: result });
    })
    .catch(() => {
      res.status(404).json({ message: 'Пользователь не найден' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(() => {
      res.json({ message: 'Пользователь успешно создан' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};
