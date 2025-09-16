const apiBase = "https://slides-indol.vercel.app"; // ajuste se mudar o domínio

async function cadastrarSlide(event) {
  event.preventDefault();

  const assunto = document.getElementById("assunto").value;
  const texto = document.getElementById("texto").value;

  try {
    const response = await fetch(`${apiBase}/slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assunto, texto })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Erro ao cadastrar");
    }

    document.getElementById("assunto").value = "";
    document.getElementById("texto").value = "";
    carregarSlides();

  } catch (error) {
    alert("Erro: " + error.message);
  }
}

let paginaAtual = 1;

async function carregarSlides(pagina = 1) {
  try {
    const response = await fetch(`${apiBase}/slides?page=${pagina}&limit=5`);
    const data = await response.json();

    const lista = document.getElementById("lista-slides");
    lista.innerHTML = "";

    data.slides.forEach(item => {
      const slide = item.slide;
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${slide.assunto}</h3>
        <p>${slide.texto}</p>
        <small><b>Data:</b> ${slide.data} | <b>Autor:</b> ${slide.autor}</small>
      `;
      lista.appendChild(card);
    });

    // Paginação
    const paginacao = document.getElementById("paginacao");
    paginacao.innerHTML = `
      <button ${data.page <= 1 ? "disabled" : ""} onclick="mudarPagina(${data.page - 1})">Anterior</button>
      <span>Página ${data.page} de ${data.totalPages}</span>
      <button ${data.page >= data.totalPages ? "disabled" : ""} onclick="mudarPagina(${data.page + 1})">Próximo</button>
    `;

  } catch (error) {
    console.error("Erro ao carregar slides:", error);
  }
}

function mudarPagina(pagina) {
  paginaAtual = pagina;
  carregarSlides(paginaAtual);
}

document.getElementById("form-slide").addEventListener("submit", cadastrarSlide);
window.onload = () => carregarSlides();
