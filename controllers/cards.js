const mongoose = require('mongoose');
const Card = require('../models/card').cardsModel;
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next)
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    Card.create({ name, link, owner: id })
      .then(() => {
        res.status(201).json({ message: 'Карточка успешно создана' });
      })
      .catch((err) => {
        throw new InternalServerError(`Произошла ошибка: ${err.toString()}`);
      })
      .catch(next)
  } else {
    try {
      throw new NotFoundError('Некорректный ID');
    }
    catch (err) {
      next(err);
    }
  }
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((result) => {
      if (result) {
        if (result.owner.equals(req.user._id)) {
          Card.remove({ _id: req.params.cardId })
            .then((card) => {
              if (card) {
                res.status(204).send();
              } else {
                throw new NotFoundError('Карточка не найдена');
              }
            })
            .catch(next);
        } else {
          throw new ForbiddenError('Доступ закрыт');
        }
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
};
