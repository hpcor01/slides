// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

// Middleware
app.use(cors());
app.use(express.json());

// ========================
// MongoDB Connection
// ========================
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://sysdba:LFpxAegi7gMZuHlT@eightcluster.nblda.mongodb.net/dbSlides?retryWrites=true&w=majority&appName=eightCluster";

const startServer = async () => {
  try {
    console.log("🔗 Conectando ao MongoDB Atlas...");
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado ao MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erro crítico ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
};

// ========================
// Models
// ========================
const slideSchema = new mongoose.Schema({
  slide: {
    data: String,
    assunto: String,
    texto: String,
    autor: String,
  },
});

const userSchema = new mongoose.Schema({
  alias: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Slide = mongoose.model("colTema", slideSchema, "colTema");
const User = mongoose.model("colUser", userSchema, "colUser");

// ========================
// Routes
// ========================

// Rota inicial
app.get("/", (req, res) => {
  res.send("API de Slides funcionando 🚀");
});

// ---- Slides ----
app.get("/slides", async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (err) {
    console.error("Erro ao buscar slides:", err.message);
    res.status(500).json({ error: "Erro ao buscar slides" });
  }
});

app.post("/slides", async (req, res) => {
  try {
    const { assunto, texto } = req.body;

    const novoSlide = new Slide({
      slide: {
        data: new Date().toISOString().split("T")[0],
        assunto,
        texto,
        autor: "Usuário Comum",
      },
    });

    await novoSlide.save();
    res.status(201).json(novoSlide);
  } catch (err) {
    console.error("Erro ao salvar slide:", err.message);
    res.status(500).json({ error: "Erro ao salvar slide" });
  }
});

// ---- Auth ----
// Registrar usuário
app.post("/auth/register", async (req, res) => {
  try {
    const { alias, password } = req.body;

    const userExist = await User.findOne({ alias });
    if (userExist) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ alias, password: hashedPass });
    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    console.error("Erro no registro:", err.message);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { alias, password } = req.body;

    const user = await User.findOne({ alias });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Senha inválida" });

    const token = jwt.sign({ id: user._id, alias: user.alias }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login realizado com sucesso", token });
  } catch (err) {
    console.error("Erro no login:", err.message);
    res.status(500).json({ error: "Erro ao realizar login" });
  }
});

// ========================
// Start
// ========================
startServer();
