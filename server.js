const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// URL do MongoDB Atlas
const mongoURL = "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/?retryWrites=true&w=majority&appName=eightCluster";
const dbName = "dbSlides";
let collection;

MongoClient.connect(mongoURL)
  .then(client => {
    console.log("Conectado ao MongoDB Atlas");
    const db = client.db(dbName);
    collection = db.collection("coltema");
  })
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// ------------------ ROTAS ------------------

// Cadastrar slide
app.post("/slides", async (req, res) => {
  try {
    const { assunto, texto } = req.body;
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const autor = "user Teste"; // fixo por enquanto

    // Verificar duplicidade por semelhança (regex case-insensitive)
    const existente = await collection.findOne({
      $or: [
        { "slide.assunto": { $regex: assunto, $options: "i" } },
        { "slide.texto": { $regex: texto, $options: "i" } }
      ]
    });

    if (existente) {
      return res.status(400).json({ error: "Slide semelhante já cadastrado" });
    }

    // Inserir no Mongo
    const novoSlide = {
      slide: { data: dataAtual, assunto, texto, autor }
    };

    await collection.insertOne(novoSlide);
    res.status(201).json({ message: "Slide cadastrado com sucesso" });

  } catch (error) {
    console.error("Erro ao cadastrar slide:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Listar slides com paginação
app.get("/slides", async (req, res) => {
  try {
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;
    const total = await collection.countDocuments();
    const slides = await collection.find({})
      .skip(skip)
      .limit(limit)
      .sort({ "slide.data": -1 })
      .toArray();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      slides
    });

  } catch (error) {
    console.error("Erro ao buscar slides:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});