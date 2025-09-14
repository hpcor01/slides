// slides.js
const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

// MongoDB URL
const uri = "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/?retryWrites=true&w=majority&appName=eightCluster";
const client = new MongoClient(uri);

let colTema;

async function conectar() {
  if (!colTema) {
    await client.connect();
    const db = client.db("dbSlides");
    colTema = db.collection("colTema");
    console.log("Conectado ao MongoDB (slides)!");
  }
}

conectar().catch(console.error);

// GET → todos os slides
router.get("/", async (req, res) => {
  try {
    await conectar();
    const slides = await colTema.find({}).toArray();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST → cadastrar novo slide
router.post("/", async (req, res) => {
  try {
    await conectar();
    const { data, assunto, texto, autor } = req.body;

    if (!data || !assunto || !texto || !autor) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const novoSlide = {
      slide: { data, assunto, texto },
      autor,
    };

    await colTema.insertOne(novoSlide);
    res.json({ message: "Slide cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
