const API_URL = "https://slides-629o.onrender.com"; // ajuste se mudar Render

async function carregarSlides() {
  try {
    const res = await fetch(`${API_URL}/slides`);
    const slides = await res.json();

    const lista = document.getElementById("slidesList");
    lista.innerHTML = "";

    if (!slides.length) {
      lista.innerHTML = "<p>Nenhum slide cadastrado.</p>";
      return;
    }

    slides.forEach(s => {
      const div = document.createElement("div");
      div.classList.add("slide-item");
      div.innerHTML = `
        <h3>${s.slide.assunto}</h3>
        <p>${s.slide.texto}</p>
        <small><b>Data:</b> ${s.slide.data} | <b>Autor:</b> ${s.autor}</small>
      `;
      lista.appendChild(div);
    });
  } catch (err) {
    console.error("Erro ao carregar slides:", err);
  }
}

document.getElementById("slideForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const assunto = document.getElementById("assunto").value.trim();
  const texto = document.getElementById("texto").value.trim();

  if (!assunto || !texto) return alert("Preencha todos os campos!");

  try {
    const res = await fetch(`${API_URL}/slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assunto, texto })
    });

    if (!res.ok) {
      const errData = await res.json();
      return alert(errData.error || "Erro ao cadastrar");
    }

    document.getElementById("slideForm").reset();
    carregarSlides();
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
  }
});

document.addEventListener("DOMContentLoaded", carregarSlides);