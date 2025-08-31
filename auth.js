const express = require("express");
const router = express.Router();
const User = require("../models/User");

// login
router.post("/login", async (req, res) => {
  const { usermail, password } = req.body;
  const user = await User.findOne({ usermail, password });
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  res.json({ id: user._id, username: user.username, level: user.level });
});

module.exports = router;
