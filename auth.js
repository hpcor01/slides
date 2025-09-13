const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

// URL do MongoDB (ajuste se usar variável de ambiente no Render)
const uri = process.env.MONGO_URI || "mongodb+srv://<user>:<pass>@<cluster>/dbSlides";
const client = new MongoClient(uri);

// Função auxiliar para conectar no banco
async function getCollection() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  const db = client.db("dbSlides");
  return db.collection("colUser");
}

// Rota de login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuário e senha são obrigatórios" });
    }

    const colUser = await getCollection();

    // Permitir login por username OU usermail
    const user = await colUser.findOne({
      $or: [{ username: username }, { usermail: username }]
    });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Usuário válido → retorna dados básicos
    res.json({
      message: "Login bem-sucedido",
      user: {
        id: user._id,
        username: user.username,
        usermail: user.usermail,
        level: user.level
      }
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

module.exports = router;
