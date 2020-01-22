const mongoose = require('mongoose');
const User = require('../models/user').usersModel;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};

module.exports.findUserById = (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findById(id)
      .then((result) => {
        if (result) {
          res.json({ data: result });
        } else {
          res.status(404).json({ message: 'Пользователь не найден' });
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'Произошла ошибка' });
      });
  } else {
    res.status(404).json({ message: 'Некорректный ID' });
  }
};

module.exports.createUser = (req, res) => {
  const { name, email, password, about, avatar } = req.body;
  bcrypt.hash(password, 10)
    .then((hash)=>{
      User.create({ name, email, password: hash, about, avatar })
        .then(() => {
          res.status(201).json({ user: { name, email, about, avatar }});
        })
        .catch(() => {
          res.status(500).json({ message: 'Произошла ошибка' });
        });
    })
    .catch(err=>{
      res.status(500).json({ message: 'Произошла ошибка' });
    })
};

module.exports.login = (req, res) => {
  const {email, password} = req.body;
  User.findOne({email}).select('+password')
    .then((data)=>{
      if(data){
      bcrypt.compare(password, data.password, (err, result)=>{
        if(result){
          const token = jwt.sign({
            _id: data._id
          }, "PassPhrase", {expiresIn: "7d"});
          res.send({token})
        }
        else {
          res.status(401).end();
        }
      })}
      else {
        res.status(401).end();
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};