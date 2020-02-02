const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user').usersModel;
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;


module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.json(result);
    })
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findById(id)
      .then((result) => {
        if (result) {
          res.json({ data: result });
        } else {
          throw new NotFoundError('Пользователь не найден');
        }
      })
      .catch(next);
  } else {
    try {
      throw new NotFoundError('Некорректный ID');
    } catch (err) {
      next(err);
    }
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash, about, avatar,
      })
        .then(() => {
          res.status(201).json({
            user: {
              name, email, about, avatar,
            },
          });
        })
        .catch(() => {
          throw new InternalServerError('Произошла ошибка');
        })
        .catch(next);
    })
    .catch(() => {
      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((data) => {
      if (data) {
        bcrypt.compare(password, data.password, (err, result) => {
          if (result) {
            const token = jwt.sign({
              _id: data._id,
            }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
            res.send({ token });
          } else {
            throw new UnauthorizedError('Требуется авторизация');
          }
        });
      } else {
        throw new UnauthorizedError('Требуется авторизация');
      }
    })
    .catch(next);
};
