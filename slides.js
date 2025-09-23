const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Definição do schema da coleção colTema
const SlideSchema = new mongoose.Schema({
  slide: {
    data: String,
    assunto: String,
    texto: String,
    autor: String
  }
}, { collection: "colTema" });

const Slide = mongoose.model("Slide", SlideSchema);

// GET - listar slides
router.get("/", async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar slides" });
  }
});

// POST - cadastrar slide com verificação de duplicados
router.post("/", async (req, res) => {
  try {
    const { assunto, texto, autor } = req.body;

    // normaliza textos
    const assuntoNorm = assunto.trim().toLowerCase();
    const textoNorm = texto.trim().toLowerCase();

    const existe = await Slide.findOne({
      "slide.assunto": { $regex: new RegExp(`^${assuntoNorm}$`, "i") },
      "slide.texto": { $regex: new RegExp(`^${textoNorm}$`, "i") }
    });

    if (existe) {
      return res.status(400).json({ error: "Slide já cadastrado" });
    }

    const novoSlide = new Slide({
      slide: {
        data: new Date().toISOString().split("T")[0],
        assunto,
        texto,
        autor: autor || "Usuário Comum"
      }
    });

    await novoSlide.save();
    res.json(novoSlide);
  } catch (err) {
    console.error("Erro ao salvar slide:", err);
    res.status(500).json({ error: "Erro ao salvar slide" });
  }
});

module.exports = router;
