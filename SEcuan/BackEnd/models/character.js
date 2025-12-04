const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  name: { type: String, required: true },
  title: String,
  role: String,
  description: String,
  rarity: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Character', characterSchema);
