const API_URL = "https://slides-629o.onrender.com/slides";

async function carregarSlides() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao carregar slides");

    const slides = await res.json();
    const slidesList = document.getElementById("slidesList");
    slidesList.innerHTML = "";

    if (slides.length === 0) {
      slidesList.innerHTML = "<p>Nenhum slide cadastrado.</p>";
      return;
    }

    slides.forEach(s => {
      const div = document.createElement("div");
      div.classList.add("slide-item");
      div.innerHTML = `
        <h3>${s.slide.assunto}</h3>
        <p>${s.slide.texto}</p>
        <small>${s.slide.data} - ${s.slide.autor}</small>
      `;
      slidesList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    document.getElementById("slidesList").innerHTML =
      "<p>Erro ao carregar slides.</p>";
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
      body: JSON.stringify({ assunto, texto })
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error || "Erro ao cadastrar slide");
    }

    document.getElementById("slideForm").reset();
    carregarSlides();
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar slide.");
  }
});

carregarSlides();