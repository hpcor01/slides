const express = require('express');
const mongoose = require('mongoose');

// URI do MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/?retryWrites=true&w=majority&appName=eightCluster';

// Conexão MongoDB (apenas UMA vez)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Schema/model
const slideSchema = new mongoose.Schema({
  assunto: { type: String, required: true },
  texto: { type: String, required: true },
  autor: { type: String, default: 'Usuário Comum' },
  data: { type: Date, default: Date.now }
});
const Slide = mongoose.model('Slide', slideSchema);

// Router Express
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const slides = await Slide.find().sort({ data: -1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar slides.' });
  }
});

router.post("/", async (req, res) => {
  const { assunto, texto, autor } = req.body;
  if (
    !assunto || typeof assunto !== "string" || assunto.trim().length === 0 ||
    !texto || typeof texto !== "string" || texto.trim().length === 0
  ) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  // Validação de duplicidade de assunto (case-insensitive)
  const temaExiste = await Slide.findOne({
    assunto: { $regex: `^${assunto.trim()}$`, $options: 'i' }
  });
  if (temaExiste) {
    return res.status(400).json({ error: "Já existe um slide com esse assunto!" });
  }

  try {
    const novoSlide = new Slide({
      assunto: assunto.trim(),
      texto: texto.trim(),
      autor: autor && autor.trim().length > 0 ? autor.trim() : undefined
    });
    await novoSlide.save();
    res.status(201).json({
      message: "Slide cadastrado com sucesso!",
      slide: novoSlide
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar slide!" });
  }
});

module.exports = router;