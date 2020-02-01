const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const { getUsers, findUserById } = require('../controllers/users');

router.get('/', auth, getUsers);

router.get('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string(),
  }),
}), findUserById);

module.exports = router;
