const router = require('express').Router();
const auth = require('../middlewares/auth');

const { getUsers, findUserById, createUser, login } = require('../controllers/users');

router.get('/', auth, getUsers);

router.get('/:id', auth, findUserById);

module.exports = router;
