const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,         // Genshin Impact, Honkai Star Rail
  },
  description: String,
  bannerImageUrl: String, // background image
  cardImageUrl: String,   // image di card di home
  servers: [String],      
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);
