const express = require("express");
const router = express.Router();
const stringSimilarity = require("string-similarity");
const Slide = require("./models/Slide"); // modelo mongoose

// Listar slides com paginação
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const slides = await Slide.find().skip(skip).limit(limit).sort({ _id: -1 });
    const total = await Slide.countDocuments();

    res.json({
      slides,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar slides" });
  }
});

// Cadastrar slide
router.post("/", async (req, res) => {
  try {
    const { assunto, texto } = req.body;

    if (!assunto || !texto) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const existentes = await Slide.find();
    const assuntos = existentes.map(s => s.slide.assunto);
    const textos = existentes.map(s => s.slide.texto);

    const simAssunto = assuntos.length ? stringSimilarity.findBestMatch(assunto, assuntos).bestMatch.rating : 0;
    const simTexto = textos.length ? stringSimilarity.findBestMatch(texto, textos).bestMatch.rating : 0;

    if (simAssunto > 0.7 || simTexto > 0.7) {
      return res.status(400).json({ error: "Slide semelhante já existe." });
    }

    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

    const novoSlide = new Slide({
      slide: { assunto, texto, data: dataFormatada, autor: "user Teste" },
    });

    await novoSlide.save();
    res.status(201).json(novoSlide);
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar slide" });
  }
});

module.exports = router;
