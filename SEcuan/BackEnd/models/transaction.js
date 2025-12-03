const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true
    },
    gameName: {
      type: String,
      required: true
    },
    packageAmount: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    server: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true  // ← Second parameter, NOT in schema
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
