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
  Card.create({ name, link, owner: id })
    .then(() => {
      res.json({ message: 'Карточка успешно создана' });
    })
    .catch((err) => {
      res.status(500).json({ message: `Произошла ошибка: ${err.toString()}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => {
      res.json({ message: 'Карточка успешно удалена' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};
