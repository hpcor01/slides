// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Inicializa o app Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor rodando! 🎉');
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
