const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Conexão com o MongoDB Atlas
mongoose.connect(
  "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/dbSlides?retryWrites=true&w=majority&appName=eightCluster"
).then(() => console.log("✅ Conectado ao MongoDB"))
 .catch(err => console.error("❌ Erro MongoDB:", err));

// 📌 Schema
const SlideSchema = new mongoose.Schema({
  slide: {
    assunto: String,
    texto: String,
    data: String
  },
  autor: { type: String, default: "user Teste" }
});

// Forçar collection = colTema
const Slide = mongoose.model("colTema", SlideSchema, "colTema");

// 📌 Listar slides
app.get("/slides", async (req, res) => {
  try {
    const slides = await Slide.find().sort({ _id: -1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Cadastrar slide (evita duplicados semelhantes)
app.post("/slides", async (req, res) => {
  try {
    const { assunto, texto } = req.body;

    // Normalizar textos para comparar
    const normalize = str =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const existing = await Slide.findOne({
      $or: [
        { "slide.assunto": new RegExp(normalize(assunto), "i") },
        { "slide.texto": new RegExp(normalize(texto), "i") }
      ]
    });

    if (existing) {
      return res.status(400).json({ error: "Slide semelhante já cadastrado!" });
    }

    const novo = new Slide({
      slide: {
        assunto,
        texto,
        data: new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })
      },
      autor: "user Teste"
    });

    await novo.save();
    res.json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Teste servidor
app.get("/ping", (req, res) => res.send("Servidor ativo 🚀"));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));