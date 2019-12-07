const users = require("../data/users");
const router = require("express").Router();

router.get("/users", (req, res)=>{
  res.send(users);
});

router.get("/users/:id", (req, res)=>{
  for (let i = 0; i<Object.keys(users).length; i++){
    if (users[i]["_id"] === req.params["id"]){
      res.send(users[i]);
      return;
    }
  }
  res.status(404);
  res.send({"message": "Нет пользователя с таким id"});
});

module.exports = router;