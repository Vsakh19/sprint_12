const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:cardId', auth, deleteCard);

module.exports = router;
