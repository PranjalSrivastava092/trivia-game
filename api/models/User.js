const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  games: 
  [{
      date: {
        type: Date,
        default: Date.now()
      },
      score: {
        type: Number,
        default: 0
      }
  }],
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);

