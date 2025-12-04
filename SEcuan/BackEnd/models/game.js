const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  bannerImageUrl: String,
  cardImageUrl: String,
  servers: [String],
  packages: [{ amount: Number, bonus: Number, price: Number }],
  featuredCharacterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Game', gameSchema);
