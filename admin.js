const express = require("express");
const router = express.Router();
const User = require("../models/User");

// criar usuário
router.post("/create", async (req, res) => {
  const { level, username, usermail, password, newLevel } = req.body;
  if (level !== 1) return res.status(403).json({ error: "Somente admin" });

  if (await User.findOne({ usermail })) return res.status(400).json({ error: "Email já cadastrado" });

  const user = new User({ username, usermail, password, level: newLevel || 0 });
  await user.save();
  res.json({ message: "Usuário criado", user });
});

// listar usuários
router.get("/list", async (req, res) => {
  const { level } = req.query;
  if (Number(level) !== 1) return res.status(403).json({ error: "Somente admin" });

  const users = await User.find().select("username usermail level");
  res.json(users);
});

module.exports = router;
