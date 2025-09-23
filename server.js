const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "dbSlides" // garante que conecta no banco certo
}).then(() => {
  console.log("Conectado ao MongoDB -> dbSlides");
}).catch(err => {
  console.error("Erro ao conectar ao MongoDB:", err);
});

// Rotas
const slidesRoutes = require("./slides");
app.use("/slides", slidesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});