// auth.js
const express = require("express");
const router = express.Router();
const User = require("./User"); // modelo mongoose

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // procurar dentro de pType
    const user = await User.findOne({ "pType.alias": username });

    if (!user) {
      return res.status(401).json({ success: false, message: "Usuário inválido" });
    }

    // comparação da senha
    if (user.pType.password !== password) {
      return res.status(401).json({ success: false, message: "Senha inválida" });
    }

    // se passou: autenticado
    return res.json({ success: true, message: "Login realizado com sucesso!" });

  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ success: false, message: "Erro no servidor" });
  }
});

module.exports = router;
