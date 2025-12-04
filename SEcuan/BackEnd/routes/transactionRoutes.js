const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Transaction = require('../models/transaction');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// simple JWT  
function verifyToken(req, res, next) {
  let header = req.headers.authorization;

  if (!header)
    return res.status(403).json({ success: false, message: "No token provided" });

  if (!header.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "Malformed token" });

  const token = header.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: "Invalid token" });

    req.user = decoded;
    next();
  });
}

// CREATE TRANSACTION
router.post('/transaction', verifyToken, async (req, res) => {
  try {
    const { gameName, packageAmount, price, uid, server } = req.body;

    const newTransaction = new Transaction({
      userEmail: req.user.email,   // from JWT, not from body
      gameName,
      packageAmount,
      price,
      uid,
      server
    });

    await newTransaction.save();
    res.json({ success: true, message: 'Top-Up Successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Transaction failed' });
  }
});

// READ ALL TRANSACTIONS
router.get('/transaction', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      userEmail: req.user.email     // filter by logged-in user
    });
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
});

// READ ONE TRANSACTION
router.get('/transaction/:id',  verifyToken,  async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch transaction' });
  }
});

// UPDATE TRANSACTION
router.put('/transaction/:id', /*verifyToken*/  async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({
      success: true,
      message: 'Transaction updated',
      data: updatedTransaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update transaction' });
  }
});

// DELETE TRANSACTION
router.delete('/transaction/:id', /*verifyToken*/ async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!deletedTransaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete transaction' });
  }
});

module.exports = router;
