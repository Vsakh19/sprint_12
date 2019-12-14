const router = require('express').Router();

const { getUsers, findUserById, createUser } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', findUserById);

router.post('/', createUser);

module.exports = router;
