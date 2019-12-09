const fs = require('fs');

const path = require('path');

const router = require('express').Router();

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/cards.json'), (err, data)=>{
    res.json(JSON.parse(data.toString("utf8")));
    }
  );
});

module.exports = router;
