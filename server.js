const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rotas de autenticação
const authRoutes = require("./auth");
app.use("/auth", authRoutes);

// Rota inicial → login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Rotas de slides
const slidesRoutes = require("./slides");
app.use("/slides", slidesRoutes);

// Teste rápido para saber se o servidor está vivo
app.get("/ping", (req, res) => {
  res.send("Servidor ativo 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
