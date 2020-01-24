const router = require('express').Router();
const auth = require('../middlewares/auth');

const { getUsers, findUserById } = require('../controllers/users');

router.get('/', auth, getUsers);

router.get('/:id', auth, findUserById);

module.exports = router;
