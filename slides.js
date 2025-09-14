const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// URI do MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/?retryWrites=true&w=majority&appName=eightCluster';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Schema e model do Slide
const slideSchema = new mongoose.Schema({
  assunto: { type: String, required: true },
  texto: { type: String, required: true },
  autor: { type: String, default: 'Usuário Comum' },
  data: { type: Date, default: Date.now }
});

const Slide = mongoose.model('Slide', slideSchema);

// GET /slides - lista todos os slides
app.get('/slides', async (req, res) => {
  try {
    const slides = await Slide.find().sort({ data: -1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar slides.' });
  }
});

// POST /slides - cadastra um novo slide
app.post('/slides', async (req, res) => {
  const { assunto, texto, autor } = req.body;

  // Validação dos campos obrigatórios
  if (
    !assunto || typeof assunto !== "string" || assunto.trim().length === 0 ||
    !texto || typeof texto !== "string" || texto.trim().length === 0
  ) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  // Verifica duplicidade de assunto (case-insensitive)
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

// Porta padrão para Render ou local
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
