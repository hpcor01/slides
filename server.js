// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// (opcional) se criar uma pasta /public com login.html, index.html, admin.html:
app.use(express.static(path.join(__dirname, "public")));

// 🔗 registre as rotas que existem
app.use("/auth", require("./auth"));
// (quando tiver as outras prontas, descomente)
// app.use("/tema", require("./tema"));
// app.use("/admin", require("./admin"));
// app.use("/export", require("./export"));

// rota simples só para teste de vida
app.get("/", (req, res) => res.send("Servidor rodando! 🎉"));

// Conexão Mongo (use MONGO_URL no Render)
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado ao MongoDB"))
.catch(err => console.error("❌ Erro MongoDB:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor na porta ${PORT}`));
