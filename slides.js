const apiUrl = "https://slides.onrender.com/slides"; // ajuste se usar local: http://localhost:10000/slides

// Formulário de cadastro
document.getElementById("slideForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const assunto = document.getElementById("assunto").value;
  const texto = document.getElementById("texto").value;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assunto, texto })
    });

    if (res.ok) {
      document.getElementById("assunto").value = "";
      document.getElementById("texto").value = "";
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
