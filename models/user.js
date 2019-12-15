const mongoose = require('mongoose');
require('mongoose-type-url');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
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
