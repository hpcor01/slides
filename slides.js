// slides.js - cliente
const API_BASE = "https://slides-629o.onrender.com"; // <--- ajuste se necessário
const LIMIT = 5;

const listaEl = document.getElementById("lista-slides");
const formEl = document.getElementById("form-slide");
const pagEl = document.getElementById("paginacao");
const msgEl = document.getElementById("mensagem"); // crie um elemento para mensagens
let paginaAtual = 1;

function showMsg(text, type = "info") {
  if (!msgEl) return alert(text);
  msgEl.className = ""; // limpar classes
  msgEl.textContent = text;
  if (type === "sucesso") msgEl.classList.add("sucesso");
  else if (type === "erro") msgEl.classList.add("erro");
  else msgEl.classList.add("info");
}

function clearMsg() {
  if (msgEl) { msgEl.textContent = ""; msgEl.className = ""; }
}

async function carregarSlides(page = 1) {
  paginaAtual = page;
  listaEl.innerHTML = "<p>Carregando...</p>";
  try {
    const res = await fetch(`${API_BASE}/slides?page=${page}&limit=${LIMIT}`);
    const contentType = (res.headers.get("content-type") || "").toLowerCase();

    if (!res.ok) {
      // tenta ler JSON de erro, senão texto
      let body = "";
      if (contentType.includes("application/json")) {
        const j = await res.json();
        body = j.error || j.message || JSON.stringify(j);
      } else {
        body = await res.text();
      }
      throw new Error(`Erro ${res.status} — ${body}`);
    }

    if (!contentType.includes("application/json")) {
      const txt = await res.text();
      throw new Error("Resposta do servidor não é JSON: " + txt.slice(0,300));
    }

    const data = await res.json();
    renderSlidesPage(data);
  } catch (err) {
    console.error(err);
    listaEl.innerHTML = `<p class="erro">Erro ao carregar slides: ${err.message}</p>`;
  }
}

function renderSlidesPage(data) {
  // Espera: { page, totalPages, slides }
  const slides = data.slides || [];
  if (slides.length === 0) {
    listaEl.innerHTML = "<p>Nenhum slide cadastrado.</p>";
  } else {
    listaEl.innerHTML = "";
    slides.forEach(item => {
      const s = item.slide || item;
      const card = document.createElement("div");
      card.className = "card slide-card";
      card.innerHTML = `
        <h3>${escapeHtml(s.assunto || "—")}</h3>
        <div class="slide-body">${nl2br(escapeHtml(s.texto || ""))}</div>
        <div class="slide-meta"><small>${escapeHtml(s.data || "")} • ${escapeHtml(s.autor || "")}</small></div>
      `;
      listaEl.appendChild(card);
    });
  }

  // paginação
  const page = data.page || 1;
  const totalPages = data.totalPages || 1;
  pagEl.innerHTML = `
    <button ${page<=1 ? "disabled" : ""} id="prevBtn">Anterior</button>
    <span>Página ${page} de ${totalPages}</span>
    <button ${page>=totalPages ? "disabled" : ""} id="nextBtn">Próximo</button>
  `;
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (prevBtn) prevBtn.onclick = () => carregarSlides(page-1);
  if (nextBtn) nextBtn.onclick = () => carregarSlides(page+1);
}

function escapeHtml(str){
  if (!str && str !== 0) return '';
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
                    .replaceAll('"','&quot;').replaceAll("'",'&#39;');
}
function nl2br(s){ return (s||'').replace(/\n/g,'<br>'); }

/* Submeter novo slide */
if (formEl) {
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg();

    const assunto = (document.getElementById("assunto") || {}).value || "";
    const texto = (document.getElementById("texto") || {}).value || "";

    if (!assunto.trim() || !texto.trim()) {
      showMsg("Preencha assunto e texto.", "erro");
      return;
    }

    const btn = formEl.querySelector('button[type="submit"]');
    btn && (btn.disabled = true);
    btn && (btn.textContent = "Enviando...");

    try {
      const res = await fetch(`${API_BASE}/slides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assunto: assunto.trim(), texto: texto.trim() })
      });

      const ct = (res.headers.get("content-type")||"").toLowerCase();
      if (!res.ok) {
        let body = "";
        if (ct.includes("application/json")) {
          const j = await res.json();
          body = j.error || j.message || JSON.stringify(j);
        } else {
          body = await res.text();
        }
        throw new Error(body || `Erro ${res.status}`);
      }

      // resposta ok
      let json = {};
      if (ct.includes("application/json")) json = await res.json();
      showMsg(json.message || "Slide cadastrado com sucesso.", "sucesso");
      formEl.reset();
      carregarSlides(1); // recarrega primeira página
    } catch (err) {
      console.error(err);
      showMsg("Erro ao cadastrar slide: " + (err.message || err), "erro");
    } finally {
      btn && (btn.disabled = false);
      btn && (btn.textContent = "Cadastrar");
    }
  });
}

/* Inicialização */
document.addEventListener("DOMContentLoaded", () => {
  carregarSlides(1);
});
