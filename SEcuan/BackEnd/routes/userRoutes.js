const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const JWT_SECRET = 'jejemiagantengkayakrey'; 

// REGISTER (CREATE)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ success: false, message: 'Email already exist' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'User Registered',
      user: { username, email },
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// LOGIN (READ + JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user by email 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!!' });
    }

    // compare raw password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!!' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login Successful',
      user: { username: user.username, email: user.email },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// READ ALL USERS
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// READ ONE USER
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// UPDATE USER
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User updated",
      data: updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

// DELETE USER
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

module.exports = router;
