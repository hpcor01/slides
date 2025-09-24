const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const slidesRoutes = require("./slides");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use("/slides", slidesRoutes);

// Conexão com MongoDB Atlas
mongoose
  .connect("mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/?retryWrites=true&w=majority&appName=eightCluster", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("❌ Erro na conexão MongoDB:", err));

// Inicia servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
