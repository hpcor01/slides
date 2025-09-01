// auth.js
const express = require("express");
const router = express.Router();
const User = require("./User"); // ✅ caminho corrigido (arquivo está na raiz)

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { usermail, password } = req.body;
    if (!usermail || !password) {
      return res.status(400).json({ error: "Informe email e senha" });
    }

    // ⚠️ simples: sem hash (igual ao seu modelo atual)
    const user = await User.findOne({ usermail, password });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    return res.json({ id: user._id, username: user.username, level: user.level });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

// (OPCIONAL) Seed inicial: cria 1 admin se NÃO existir nenhum usuário
// Use uma vez e depois remova/ comente.
router.post("/seed-admin", async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return res.status(400).json({ error: "Já existe usuário na base" });

    const admin = await User.create({
      username: "Admin",
      usermail: "admin@local",
      password: "admin", // simples, só para subir
      level: 1
    });

    return res.json({
      message: "Admin criado",
      credenciais: { usermail: admin.usermail, password: "admin" }
    });
  } catch (err) {
    console.error("Erro no seed:", err);
    return res.status(500).json({ error: "Erro ao criar admin" });
  }
});

module.exports = router;
