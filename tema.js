const express = require("express");
const router = express.Router();
const Tema = require("../models/Tema");

// cadastrar slide (nível 0)
router.post("/add", async (req, res) => {
  const { userId, level, assunto, texto } = req.body;
  if (level !== 0) return res.status(403).json({ error: "Apenas nível 0 pode cadastrar" });

  const existente = await Tema.findOne({
    $or: [{ "slide.assunto": assunto }, { "slide.texto": texto }]
  });
  if (existente) return res.status(400).json({ error: "Slide duplicado" });

  const novo = new Tema({ userId, slide: { assunto, texto } });
  await novo.save();
  res.json({ message: "Slide cadastrado", slide: novo });
});

// listar slides nível 0 (assunto + autor + data)
router.get("/list/basic", async (req, res) => {
  const slides = await Tema.find()
    .populate("userId", "username")
    .select("slide.assunto slide.data userId");

  res.json(slides.map(s => ({
    assunto: s.slide.assunto,
    autor: s.userId.username,
    data: s.slide.data
  })));
});

// listar slides completo para admin
router.get("/list/full", async (req, res) => {
  const slides = await Tema.find()
    .populate("userId", "username usermail")
    .sort({ "slide.data": 1 });

  res.json(slides);
});

// editar slide (admin)
router.put("/edit/:id", async (req, res) => {
  const { level, assunto, texto } = req.body;
  if (level !== 1) return res.status(403).json({ error: "Somente admin" });

  const slide = await Tema.findByIdAndUpdate(req.params.id, {
    "slide.assunto": assunto,
    "slide.texto": texto
  }, { new: true });

  if (!slide) return res.status(404).json({ error: "Slide não encontrado" });
  res.json({ message: "Slide atualizado", slide });
});

// excluir slide (admin)
router.delete("/delete/:id", async (req, res) => {
  const { level } = req.body;
  if (level !== 1) return res.status(403).json({ error: "Somente admin" });

  const slide = await Tema.findByIdAndDelete(req.params.id);
  if (!slide) return res.status(404).json({ error: "Slide não encontrado" });

  res.json({ message: "Slide excluído" });
});

module.exports = router;
