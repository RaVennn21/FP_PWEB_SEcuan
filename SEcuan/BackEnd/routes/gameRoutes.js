const express = require('express');
const router = express.Router();

const Game = require('../models/game');
const Character = require('../models/character');

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
    const games = await Game.find().populate('featuredCharacterId');
    res.json({ success: true, data: games });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch games' });
  }
});

// READ ONE GAME
router.get('/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('featuredCharacterId');
    
    if (!game) {
      return res.status(404).json({ 
        success: false, 
        message: 'Game not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: {
        ...game.toObject(),
        featuredCharacter: game.featuredCharacterId
      }
    });
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

// SET or UPDATE featured character for a game
router.post('/games/:id/featured-character', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    const { name, title, role, description, imageUrl, rarity } = req.body;

    // either update existing character for this game, or create new one
    let character = await Character.findOne({ game: game._id });

    if (!character) {
      character = new Character({
        game: game._id,
        name,
        title,
        role,
        description,
        rarity
      });
    } else {
      character.name = name;
      character.title = title;
      character.role = role;
      character.description = description;
      character.rarity = rarity;
    }

    await character.save();

    // link to game
    game.featuredCharacterId = character._id;
    await game.save();

    const result = await Game.findById(game._id)
      .populate('featuredCharacterId');

    res.json({
      success: true,
      message: 'Featured character saved',
      data: {
        game: result,
        featuredCharacter: result.featuredCharacterId
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to save featured character' });
  }
});


module.exports = router;
