const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// CORS ajustado para liberar apenas seu frontend Vercel
const corsOptions = {
  origin: ["https://slides-indol.vercel.app"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions)); // <--- ANTES das rotas

app.use(express.json());

// Schema Slide
const slideSchema = new mongoose.Schema({
  slide: {
    data: String,
    assunto: String,
    texto: String,
    autor: String
  }
});

// Conecta ao Mongo Atlas e usa dbSlides, collection colTema
const Slide = mongoose.model("colTema", slideSchema, "colTema");

// Rotas
app.get("/", (req, res) => {
  res.send("API de Slides funcionando 🚀");
});

// Listar todos os slides
app.get("/slides", async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (err) {
    console.error("Erro ao buscar slides:", err.message);
    res.status(500).json({ error: "Erro ao buscar slides" });
  }
});

// Criar novo slide
app.post("/slides", async (req, res) => {
  try {
    const { assunto, texto, autor, data } = req.body;
    if (!assunto || !texto || !autor || !data) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    // Buscar slides existentes para evitar duplicatas por similaridade
    const slides = await Slide.find();
    const isSimilar = slides.some(s =>
      (s.slide.assunto && s.slide.assunto.toLowerCase() === assunto.toLowerCase()) ||
      (s.slide.texto && s.slide.texto.toLowerCase() === texto.toLowerCase())
    );
    if (isSimilar) {
      return res.status(400).json({ error: "Slide semelhante já existe!" });
    }
    const novoSlide = new Slide({
      slide: { data, assunto, texto, autor }
    });
    await novoSlide.save();
    res.status(201).json(novoSlide);
  } catch (err) {
    console.error("Erro ao salvar slide:", err.message);
    res.status(500).json({ error: "Erro ao salvar slide" });
  }
});

// Start server
const startServer = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/dbSlides?retryWrites=true&w=majority&appName=eightCluster";

    console.log("Tentando conectar ao MongoDB em:", mongoURI);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Conectado ao MongoDB");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erro crítico ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
};

startServer();
