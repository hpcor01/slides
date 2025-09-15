// slides.js
const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

// URL do Mongo Atlas
const url =
  process.env.MONGO_URL ||
  "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/?retryWrites=true&w=majority&appName=eightCluster";

const dbName = "dbAvalia";
let collection;

// Conexão com o MongoDB
MongoClient.connect(url)
  .then((client) => {
    console.log("Conectado ao MongoDB (slides)!");
    const db = client.db(dbName);
    collection = db.collection("coltema");
  })
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Função para formatar data por extenso em pt-BR
function getDataExtenso() {
  const hoje = new Date();
  return hoje.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Rota: listar slides
router.get("/", async (req, res) => {
  try {
    const slides = await collection.find().toArray();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: cadastrar novo slide
router.post("/", async (req, res) => {
  try {
    const { assunto, texto } = req.body;

    if (!assunto || !texto) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const novoSlide = {
      slide: {
        data: getDataExtenso(), // data automática por extenso
        assunto,
        texto,
      },
    };

    const result = await collection.insertOne(novoSlide);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
