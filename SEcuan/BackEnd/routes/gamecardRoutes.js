const express = require("express");
const router = express.Router();
const GameCard = require("../models/gamecard");

// GET all cards
router.get("/", async (req, res) => {
  try {
    const cards = await GameCard.find();
    res.json({ success: true, data: cards });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load cards" });
  }
});

// POST new card
router.post("/", async (req, res) => {
  try {
    const card = new GameCard(req.body);
    await card.save();
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create card" });
  }
});

// UPDATE card image
router.put("/:id", async (req, res) => {
  try {
    const updated = await GameCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to update card" });
  }
});

// DELETE card
router.delete("/:id", async (req, res) => {
  try {
    await GameCard.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete card" });
  }
});

module.exports = router;
