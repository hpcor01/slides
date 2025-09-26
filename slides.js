const apiUrl = "https://slides.onrender.com/slides"; // ajuste para local: http://localhost:10000/slides

// Algoritmo de similaridade (Levenshtein)
function similaridade(a, b) {
  if (!a || !b) return 0;
  a = a.toLowerCase();
  b = b.toLowerCase();
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  const dist = matrix[a.length][b.length];
  return 1 - dist / Math.max(a.length, b.length);
}

// Formulário de cadastro
document.getElementById("slideForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const assunto = document.getElementById("assunto").value;
  const texto = document.getElementById("texto").value;
  const autor = document.getElementById("autor").value;
  const now = new Date();
  const data = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Buscar slides existentes para evitar duplicatas
  const resList = await fetch(apiUrl);
  const slides = await resList.json();
  const similar = slides.some(s =>
    similaridade(s.slide.assunto, assunto) > 0.8 ||
    similaridade(s.slide.texto, texto) > 0.8
  );
  if (similar) {
    alert("Slide semelhante já existe!");
    return;
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assunto, texto, autor, data })
    });

    if (res.ok) {
      document.getElementById("assunto").value = "";
      document.getElementById("texto").value = "";
      document.getElementById("autor").value = "";
      carregarSlides();
    } else {
      alert("Erro ao cadastrar slide.");
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
});

// Carregar slides já cadastrados
async function carregarSlides() {
  try {
    const res = await fetch(apiUrl);
    const slides = await res.json();
    const slideList = document.getElementById("slideList");
    slideList.innerHTML = "";
    slides.forEach((s) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${s.slide.assunto}</strong> - ${s.slide.texto} <br>
        <small>${s.slide.data} | ${s.slide.autor}</small>`;
      slideList.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar slides:", err);
  }
}

// Carregar ao abrir
carregarSlides();