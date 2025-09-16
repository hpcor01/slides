const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const client = require("./db"); // conexão Mongo
const natural = require("natural");

// Função para calcular similaridade entre dois textos
function similarity(text1, text2) {
  const tfidf = new natural.TfIdf();

  tfidf.addDocument(text1);
  tfidf.addDocument(text2);

  const vec1 = [];
  const vec2 = [];

  tfidf.listTerms(0).forEach(item => {
    vec1.push(item.tfidf);
    vec2.push(tfidf.tfidf(item.term, 1));
  });

  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitude1 * magnitude2 || 1);
}

// 🔹 Rota GET – listar slides
router.get("/", async (req, res) => {
  try {
    const db = client.db("dbSlides");
    const slides = await db.collection("colTema").find().toArray();
    res.json(slides);
  } catch (err) {
    console.error("Erro ao buscar slides:", err);
    res.status(500).json({ error: "Erro ao buscar slides" });
  }
});

// 🔹 Rota POST – cadastrar slide
router.post("/", async (req, res) => {
  try {
    const { assunto, texto } = req.body;
    if (!assunto || !texto) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const db = client.db("dbSlides");
    const collection = db.collection("colTema");

    // Buscar todos os slides existentes
    const existentes = await collection.find().toArray();

    // Verificar duplicidade por similaridade
    const LIMIAR = 0.75; // pode ajustar (0.7 ~ 0.8 geralmente é bom)

    for (const slide of existentes) {
      const simAssunto = similarity(assunto, slide.slide.assunto || "");
      const simTexto = similarity(texto, slide.slide.texto || "");

      if (simAssunto >= LIMIAR || simTexto >= LIMIAR) {
        return res.status(409).json({ 
          error: "Slide semelhante já cadastrado.",
          similar: { assunto: slide.slide.assunto, texto: slide.slide.texto }
        });
      }
    }

    // Inserir novo slide
    const novoSlide = {
      slide: {
        data: new Date().toLocaleDateString("pt-BR"),
        assunto,
        texto
      }
    };

    await collection.insertOne(novoSlide);
    res.status(201).json({ message: "Slide cadastrado com sucesso!" });

  } catch (err) {
    console.error("Erro ao cadastrar slide:", err);
    res.status(500).json({ error: "Erro ao cadastrar slide" });
  }
});

// 🔹 Rota DELETE – remover por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db("dbSlides");
    await db.collection("colTema").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Slide removido com sucesso!" });
  } catch (err) {
    console.error("Erro ao remover slide:", err);
    res.status(500).json({ error: "Erro ao remover slide" });
  }
});

module.exports = router;
