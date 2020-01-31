const router = require('express').Router();
const auth = require('../middlewares/auth');
const {celebrate, Joi} = require('celebrate');

const { getUsers, findUserById } = require('../controllers/users');

router.get('/', auth, getUsers);

router.get('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string(),
  })
}), findUserById);

module.exports = router;
