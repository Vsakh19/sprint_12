const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', auth, getCards);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required()
  })
}), createCard);
router.delete('/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string(),
  })
}), deleteCard);

module.exports = router;
