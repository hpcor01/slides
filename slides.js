// slides.js

// URL base da API hospedada no Render
const API_URL = "https://seu-projeto.onrender.com"; // troque pelo domínio real do Render

// Função para carregar slides
async function carregarSlides() {
  try {
    const response = await fetch(`${API_URL}/slides`);
    const slides = await response.json();

    const container = document.getElementById("slidesContainer");
    container.innerHTML = "";

    if (slides.length === 0) {
      container.innerHTML = "<p>Nenhum slide encontrado.</p>";
      return;
    }

    slides.forEach((s) => {
      const card = document.createElement("div");
      card.classList.add("slide-card");

      card.innerHTML = `
        <h3>${s.slide.assunto}</h3>
        <p>${s.slide.texto}</p>
        <small><b>Data:</b> ${s.slide.data} | <b>Autor:</b> ${s.slide.autor}</small>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar slides:", err);
    alert("Erro ao carregar slides!");
  }
}

// Função para adicionar novo slide
async function adicionarSlide(event) {
  event.preventDefault();

  const assunto = document.getElementById("assunto").value;
  const texto = document.getElementById("texto").value;

  if (!assunto || !texto) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assunto, texto }),
    });

    if (response.ok) {
      alert("Slide adicionado com sucesso!");
      document.getElementById("slideForm").reset();
      carregarSlides();
    } else {
      alert("Erro ao adicionar slide!");
    }
  } catch (err) {
    console.error("Erro ao adicionar slide:", err);
    alert("Erro ao adicionar slide!");
  }
}

// Carregar slides ao abrir a página
window.onload = carregarSlides;
