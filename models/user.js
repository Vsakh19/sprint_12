const mongoose = require('mongoose');
const validator = require('validator');
require('mongoose-type-url');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid email'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  about: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
});

module.exports.usersModel = mongoose.model('user', usersSchema);
