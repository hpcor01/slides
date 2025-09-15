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

// Servir arquivos diretamente da raiz
app.use(express.static(__dirname));

// Rotas de autenticação
const authRoutes = require("./auth");
app.use("/auth", authRoutes);

// Rotas de slides
const slidesRoutes = require("./slides");
app.use("/slides", slidesRoutes);

// Rotas para HTML principais
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // cadastro
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Teste rápido para saber se o servidor está vivo
app.get("/ping", (req, res) => {
  res.send("Servidor ativo 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
