const express = require('express');
const router = express.Router();

const Game = require('../models/game');

// CREATE GAME
router.post('/games', async (req, res) => {
  try {
    const newGame = new Game(req.body);
    await newGame.save();
    res.json({ success: true, message: 'Game created', data: newGame });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create game' });
  }
});

// READ ALL GAMES
router.get('/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json({ success: true, data: games });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch games' });
  }
});

// READ ONE GAME
router.get('/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    res.json({ success: true, data: game });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch game' });
  }
});

// UPDATE GAME
router.put('/games/:id', async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.json({
      success: true,
      message: 'Game updated',
      data: updatedGame
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update game' });
  }
});

// DELETE GAME
router.delete('/games/:id', async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);

    if (!deletedGame) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.json({ success: true, message: 'Game deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete game' });
  }
});

module.exports = router;
