const express = require("express");
const router = express.Router();
const User = require("./User");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: "Usuário inválido" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Senha inválida" });
    }

    return res.json({
      success: true,
      message: "Login realizado com sucesso!",
      level: user.level // já devolvendo nível, se precisar
    });

  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ success: false, message: "Erro no servidor" });
  }
});

module.exports = router;
