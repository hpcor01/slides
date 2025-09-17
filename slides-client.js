const API_URL = "https://slides-629o.onrender.com/slides";

async function carregarSlides(page = 1) {
  try {
    const res = await fetch(`${API_URL}?page=${page}`);
    if (!res.ok) throw new Error("Erro ao carregar slides");

    const data = await res.json();
    const slides = data.slides;
    const slidesList = document.getElementById("slidesList");
    slidesList.innerHTML = "";

    if (slides.length === 0) {
      slidesList.innerHTML = "<p>Nenhum slide cadastrado.</p>";
      return;
    }

    slides.forEach(slide => {
      const div = document.createElement("div");
      div.classList.add("slide-item");
      div.innerHTML = `
        <h3>${slide.slide.assunto}</h3>
        <p>${slide.slide.texto}</p>
        <small>${slide.slide.data} - ${slide.slide.autor}</small>
      `;
      slidesList.appendChild(div);
    });

    // Paginação
    const pagDiv = document.getElementById("pagination");
    pagDiv.innerHTML = "";
    for (let i = 1; i <= data.totalPages; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      if (i === data.currentPage) btn.disabled = true;
      btn.onclick = () => carregarSlides(i);
      pagDiv.appendChild(btn);
    }
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("slideForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const assunto = document.getElementById("assunto").value.trim();
  const texto = document.getElementById("texto").value.trim();

  if (!assunto || !texto) return alert("Preencha todos os campos!");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assunto, texto }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || "Erro ao cadastrar slide");
      return;
    }

    document.getElementById("slideForm").reset();
    carregarSlides();
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar slide.");
  }
});

// Inicializa
carregarSlides();
