const modal = document.getElementById("modal");
const filterModal = document.getElementById("filterModal");

const addBtn = document.getElementById("addBtn");
const filterBtn = document.getElementById("filterBtn");
const closeBtn = document.getElementById("close");
const closeFilterBtn = document.getElementById("closeFilter");
const saveBtn = document.getElementById("save");
const applyFilterBtn = document.getElementById("applyFilter");
const clearFilterBtn = document.getElementById("clearFilter");

const grid = document.getElementById("reviewsGrid");

let allReviews = [];

addBtn.onclick = () => (modal.style.display = "flex");
closeBtn.onclick = () => (modal.style.display = "none");

filterBtn.onclick = () => (filterModal.style.display = "flex");
closeFilterBtn.onclick = () => (filterModal.style.display = "none");

clearFilterBtn.onclick = () => {
  document.getElementById("filterNome").value = "";
  document.getElementById("filterNotaMin").value = "";
  document.getElementById("filterDataDe").value = "";
  document.getElementById("filterDataAte").value = "";
  renderReviews(allReviews);
  filterModal.style.display = "none";
};

function starsHTML(rating) {
  const filled = "★".repeat(Math.round(rating));
  const empty = "☆".repeat(5 - Math.round(rating));
  return `<span class="stars">${filled}${empty}</span>`;
}

function renderReviews(reviews) {
  grid.innerHTML = reviews.map(r => `
    <div class="card">
      <img src="${r.capa || 'https://via.placeholder.com/300x450?text=No+Image'}" alt="Poster">
      <div class="card-content">
        <h2>${r.nomefilme}</h2>
        <div class="genre">${r.genero || "Sem gênero"}</div>
        <div class="comment">${r.comentario || ""}</div>
        ${starsHTML(r.nota)}
        <div class="date">${r.data || ""}</div>
        <button class="delete-btn" onclick="deleteReview(${r.id})">✖</button>
      </div>
    </div>
  `).join("");
}

async function loadReviews() {
  const res = await fetch("/api/avaliacoes");
  allReviews = await res.json();
  renderReviews(allReviews);
}

saveBtn.onclick = async () => {
  const body = {
    nomefilme: nomefilme.value,
    nota: parseInt(nota.value),
    generoid: parseInt(generoid.value),
    comentario: comentario.value,
    data: data.value
  };

  await fetch("/api/avaliacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  modal.style.display = "none";
  await loadReviews();
};

window.deleteReview = async id => {
  await fetch(`/api/avaliacoes/${id}`, { method: "DELETE" });
  await loadReviews();
};

applyFilterBtn.onclick = () => {
  const nome = document.getElementById("filterNome").value.toLowerCase();
  const notaMin = parseFloat(document.getElementById("filterNotaMin").value) || 0;
  const dataDe = document.getElementById("filterDataDe").value;
  const dataAte = document.getElementById("filterDataAte").value;

  const filtered = allReviews.filter(r => {
    const matchNome = r.nomefilme.toLowerCase().includes(nome);
    const matchNota = r.nota >= notaMin;
    const matchDataDe = !dataDe || r.data >= dataDe;
    const matchDataAte = !dataAte || r.data <= dataAte;
    return matchNome && matchNota && matchDataDe && matchDataAte;
  });

  renderReviews(filtered);
  filterModal.style.display = "none";
};

loadReviews();
