const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userEmail: String,
    gameName: String,
    packageAmount: String,
    price: String,
    uid: String,
    server: String,
    date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Transaction', transactionSchema)