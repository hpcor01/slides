document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  const assuntoInput = document.getElementById("assunto");
  const textoInput = document.getElementById("texto");
  const listaSlides = document.getElementById("listaSlides");

  const API_URL = "https://slides-629o.onrender.com/slides";

  async function carregarSlides() {
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error("Erro ao buscar slides");
      const slides = await resposta.json();

      listaSlides.innerHTML = "";
      slides.forEach((slide) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${slide.slide.assunto}: ${slide.slide.texto}`;
        listaSlides.appendChild(li);
      });
    } catch (erro) {
      console.error("Erro ao carregar slides:", erro);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoSlide = {
      slide: {
        data: new Date().toLocaleDateString("pt-BR"),
        assunto: assuntoInput.value,
        texto: textoInput.value,
      },
    };

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoSlide),
      });

      if (!resposta.ok) throw new Error("Erro ao cadastrar slide");

      assuntoInput.value = "";
      textoInput.value = "";
      carregarSlides();
    } catch (erro) {
      console.error("Erro ao cadastrar slide:", erro);
    }
  });

  carregarSlides();
});
