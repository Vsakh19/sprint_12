const cards = require("../data/cards");
const router = require("express").Router();

router.get("/cards", (req, res)=>{
  res.send(cards);
});

module.exports = router;