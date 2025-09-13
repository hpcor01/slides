// slides.js
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB URL
const uri = "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/?retryWrites=true&w=majority&appName=eightCluster";
const client = new MongoClient(uri);

let colTema;

async function conectar() {
    await client.connect();
    const db = client.db("dbSlides");
    colTema = db.collection("colTema");
    console.log("Conectado ao MongoDB (slides)!");
}

conectar().catch(console.error);

// GET → todos os slides
router.get("/", async (req, res) => {
    try {
        const slides = await colTema.find({}).toArray();
        res.json(slides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST → cadastrar novo slide
router.post("/", async (req, res) => {
    try {
        const { data, assunto, texto, autor } = req.body;
        const novoSlide = { slide: { data, assunto, texto }, autor };
        const result = await colTema.insertOne(novoSlide);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
