const express = require("express");
const app = express();
const {PORT = 3000} = process.env;
const path = require("path");
const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const cards = require("./data/cards");

app.use(express.static(path.join(__dirname, "public")));
app.use(userRouter);
app.use(cardsRouter);

app.listen(PORT, ()=>{
  console.log("Worked");
});

app.get("*", (req, res)=>{
  res.send({ "message": "Запрашиваемый ресурс не найден" });
});