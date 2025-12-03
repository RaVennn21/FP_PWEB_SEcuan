const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'jejemiagantengkayakrey';

// MIDDLEWARE: Verify JWT Token
function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  
  if (!header) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Malformed token' });
  }

  const token = header.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// MIDDLEWARE: Check if user is admin
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ success: false, message: 'Not authenticated' });
  }

  // Find user and check admin status
  User.findById(req.user.id, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.admin = user;
    next();
  });
}

// GET: Check if current user is admin
router.get('/admin/status', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      isAdmin: user?.isAdmin || false,
      user: { username: user.username, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error checking admin status' });
  }
});

// GET: All users (admin only)
router.get('/admin/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// POST: Make user an admin (admin only)
router.post('/admin/make-admin/:userId', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `${user.username} is now an admin`,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to make admin' });
  }
});

// POST: Remove admin privileges (admin only)
router.post('/admin/remove-admin/:userId', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `Admin privileges removed from ${user.username}`,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to remove admin' });
  }
});

// DELETE: Delete user (admin only)
router.delete('/admin/users/:userId', verifyToken, isAdmin, async (req, res) => {
  try {
    // Prevent deleting yourself
    if (req.user.id === req.params.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

module.exports = router;