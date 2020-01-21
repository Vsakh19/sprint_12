const mongoose = require('mongoose');
const Card = require('../models/card').cardsModel;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
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
        res.status(500).json({ message: `Произошла ошибка: ${err.toString()}` });
      });
  } else {
    res.status(404).json({ message: 'Некорректный ID' });
  }
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then(res=>{
      if (req.user._id===res[0].owner){
        Card.findByIdAndRemove(req.params.cardId)
          .then((card) => {
            if (card) {
              res.status(204).send();
            } else {
              res.status(404).json({ message: 'Карточка не найдена' });
            }
          })
          .catch(() => {
            res.status(500).json({ message: 'Произошла ошибка' });
          });
      }
    })
    .catch(err=>{
      res.status(403).end();
    })
};