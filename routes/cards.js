const fs = require('fs');

const path = require('path');

const cards = fs.readFileSync(path.join(__dirname, '../data/cards.json'), { encoding: 'utf8' });
const router = require('express').Router();

router.get('/', (req, res) => {
  res.json(cards);
});

module.exports = router;
