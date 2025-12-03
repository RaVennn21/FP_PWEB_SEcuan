const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true          //game asal char nya
  },
  name: {
    type: String,
    required: true
  },
  title: String,            // title dari char nya, kek durin the dragon 
  role: String,             
  description: String,
  imageUrl: String,         // image char
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Character', characterSchema);
