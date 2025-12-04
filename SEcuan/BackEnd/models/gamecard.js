const mongoose = require('mongoose');

const gameCardSchema = new mongoose.Schema({
  gameId: {
    type: Number,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('GameCard', gameCardSchema);
