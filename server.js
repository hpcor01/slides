const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const stringSimilarity = require("string-similarity");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 Conexão com MongoDB Atlas
mongoose.connect(
  "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/dbSlides?retryWrites=true&w=majority&appName=eightCluster",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const slideSchema = new mongoose.Schema({
  slide: {
    assunto: String,
    texto: String,
    data: String,
    autor: String,
  },
});

const Slide = mongoose.model("colTema", slideSchema);

// 🔹 Endpoint para listar slides com paginação
app.get("/slides", async (req, res) => {
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

// 🔹 Endpoint para cadastrar slide
app.post("/slides", async (req, res) => {
  try {
    const { assunto, texto } = req.body;

    if (!assunto || !texto) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    // Busca todos para verificar similaridade
    const existentes = await Slide.find();
    const assuntos = existentes.map(s => s.slide.assunto);
    const textos = existentes.map(s => s.slide.texto);

    const simAssunto = assuntos.length ? stringSimilarity.findBestMatch(assunto, assuntos).bestMatch.rating : 0;
    const simTexto = textos.length ? stringSimilarity.findBestMatch(texto, textos).bestMatch.rating : 0;

    if (simAssunto > 0.7 || simTexto > 0.7) {
      return res.status(400).json({ error: "Slide semelhante já existe no banco." });
    }

    // Data atual formatada
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

    const novoSlide = new Slide({
      slide: {
        assunto,
        texto,
        data: dataFormatada,
        autor: "user Teste", // 🔹 por enquanto fixo
      },
    });

    await novoSlide.save();
    res.status(201).json(novoSlide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar slide" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));