// ... código inicial igual ...
// Listar todos os slides
app.get("/slides", async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (err) {
    console.error("Erro ao buscar slides:", err.message);
    res.status(500).json({ error: "Erro ao buscar slides" });
  }
});

// Criar novo slide
app.post("/slides", async (req, res) => {
  try {
    const { assunto, texto, autor, data } = req.body;
    if (!assunto || !texto || !autor || !data) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    // Buscar slides existentes para evitar duplicatas por similaridade
    const slides = await Slide.find();
    const isSimilar = slides.some(s =>
      // Pode usar uma função de similaridade do lado do servidor também
      (s.slide.assunto && s.slide.assunto.toLowerCase() === assunto.toLowerCase()) ||
      (s.slide.texto && s.slide.texto.toLowerCase() === texto.toLowerCase())
    );
    if (isSimilar) {
      return res.status(400).json({ error: "Slide semelhante já existe!" });
    }
    const novoSlide = new Slide({
      slide: { data, assunto, texto, autor }
    });
    await novoSlide.save();
    res.status(201).json(novoSlide);
  } catch (err) {
    console.error("Erro ao salvar slide:", err.message);
    res.status(500).json({ error: "Erro ao salvar slide" });
  }
});