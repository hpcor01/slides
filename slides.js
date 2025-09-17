const express = require("express");
const { MongoClient } = require("mongodb");
const stringSimilarity = require("string-similarity");

const router = express.Router();

// Função para verificar se dois textos são parecidos
function textosParecidos(a, b) {
  if (!a || !b) return false;
  const similaridade = stringSimilarity.compareTwoStrings(
    a.toLowerCase(),
    b.toLowerCase()
  );
  return similaridade > 0.5; // ajuste do limiar (0.5 = 50%)
}

// Rota para salvar slide
router.post("/slides", async (req, res) => {
  try {
    const { assunto, texto } = req.body;
    if (!assunto || !texto) {
      return res.status(400).json({ error: "Assunto e texto são obrigatórios" });
    }

    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    const db = client.db("dbSlides");
    const col = db.collection("colTema");

    // Buscar todos os slides já cadastrados
    const existentes = await col.find().toArray();

    // Verificar se algum é parecido
    const duplicado = existentes.find((doc) => {
      return (
        textosParecidos(doc.slide.assunto, assunto) ||
        textosParecidos(doc.slide.texto, texto)
      );
    });

    if (duplicado) {
      await client.close();
      return res.status(409).json({ error: "Slide semelhante já cadastrado!" });
    }

    // Inserir se não tiver duplicado
    await col.insertOne({
      slide: {
        assunto,
        texto,
        data: new Date().toISOString(),
      },
    });

    await client.close();
    res.status(201).json({ message: "Slide cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao cadastrar slide:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
