const express = require('express');
const router = express.Router();

const Character = require('../models/character');

// CREATE CHAR
router.post('/characters', async (req, res) => {
  try {
    const newCharacter = new Character(req.body);  
    await newCharacter.save();
    res.json({ success: true, message: 'Character created', data: newCharacter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create character' });
  }
});

// READ ALL CHAR
router.get('/characters', async (req, res) => {
  try {
    const character = await Character.find(req.params.id).populate('game', 'name');
    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }
    res.json({ success: true, data: character });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch character' });
  }
});

// READ ONE CHAR
router.get('/characters/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate('game', 'name');
    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }
    res.json({ success: true, data: character });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch character' });
  }
});

// UPDATE CHAR
router.put('/characters/:id', async (req, res) => {
  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCharacter) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    res.json({
      success: true,
      message: 'Character updated',
      data: updatedCharacter
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update character' });
  }
});

// DELETE CHAR
router.delete('/characters/:id', async (req, res) => {
  try {
    const deletedCharacter = await Character.findByIdAndDelete(req.params.id);

    if (!deletedCharacter) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    res.json({ success: true, message: 'Character deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete character' });
  }
});

module.exports = router;
