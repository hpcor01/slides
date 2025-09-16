const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(express.json());
const corsOptions = {
  origin: ["https://slides-indol.vercel.app"], // frontend Vercel
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));

// Conexão com o MongoDB
mongoose.connect(
  "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/dbSlides?retryWrites=true&w=majority&appName=eightCluster",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  console.log("✅ Conectado ao MongoDB");
}).catch(err => {
  console.error("❌ Erro ao conectar no MongoDB:", err);
});

// Schema do slide
const slideSchema = new mongoose.Schema({
  slide: {
    assunto: String,
    texto: String,
    data: String,
    autor: String
  }
}, { collection: "colTema" });

const Slide = mongoose.model("Slide", slideSchema);

//
// 📌 Rota GET com paginação
//
app.get("/slides", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // página atual
    const limit = parseInt(req.query.limit) || 5; // qtde por página
    const skip = (page - 1) * limit;

    const slides = await Slide.find().skip(skip).limit(limit).sort({ "slide.data": -1 });
    const total = await Slide.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      slides
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar slides" });
  }
});

//
// 📌 Rota POST (cadastrar novo slide)
//
app.post("/slides", async (req, res) => {
  try {
    const { assunto, texto } = req.body;
    if (!assunto || !texto) {
      return res.status(400).json({ error: "Assunto e texto são obrigatórios" });
    }

    // 🔎 Verificação de duplicidade (assunto OU texto semelhantes)
    const existente = await Slide.findOne({
      $or: [
        { "slide.assunto": { $regex: new RegExp(assunto, "i") } },
        { "slide.texto": { $regex: new RegExp(texto, "i") } }
      ]
    });

    if (existente) {
      return res.status(409).json({ error: "Já existe um slide com assunto ou texto semelhante" });
    }

    // Criar novo slide
    const novo = new Slide({
      slide: {
        assunto,
        texto,
        data: new Date().toLocaleDateString("pt-BR"),
        autor: "user Teste"
      }
    });

    await novo.save();
    res.status(201).json({ message: "Slide cadastrado com sucesso", slide: novo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar slide" });
  }
});

//
// 📌 Inicializar servidor
//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

