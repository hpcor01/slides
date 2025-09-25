const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Modelo do slide
const slideSchema = new mongoose.Schema({
  slide: {
    data: String,
    assunto: String,
    texto: String,
  },
});

const Slide = mongoose.model("Slide", slideSchema, "coltema");

// GET - listar todos os slides
router.get("/", async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - adicionar slide
router.post("/", async (req, res) => {
  try {
    const novoSlide = new Slide(req.body);
    await novoSlide.save();
    res.status(201).json(novoSlide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
