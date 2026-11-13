import {
  onGetSeries,
  saveSeries,
  deleteSeries,
  getSeries,
  updateSeries,
  logoutUser,
  onAuthChange,
} from "./Conexion123.js";

// ── Referencias DOM ───────────────────────────────────────
const app           = document.getElementById("app");
const taskContainer = document.getElementById("tasks-container");
const taskForm      = document.getElementById("task-form");
const btnSave       = document.getElementById("btn-task-save");
const btnLogout     = document.getElementById("btn-logout");
const open          = document.getElementById("icono-open");
const close         = document.getElementById("icono-close");
const contenidoForm = document.getElementById("contenido-form");

// ── Modal de edición ──────────────────────────────────────
const editModal     = document.getElementById("edit-modal");
const editForm      = document.getElementById("edit-form");
const modalClose    = document.getElementById("modal-close");
const modalCancel   = document.getElementById("modal-cancel");
const editTitle     = document.getElementById("edit-title");
const editSinopsis  = document.getElementById("edit-sinopsis");
const editComentario = document.getElementById("edit-comentario");

let editId = "";

function openModal(task, docId) {
  editTitle.value       = task.Titulo;
  editSinopsis.value    = task.Sinopsis;
  editComentario.value  = task.Comentario;
  editId = docId;
  editModal.classList.add("active");
}

function closeModal() {
  editModal.classList.remove("active");
}

modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);
editModal.addEventListener("click", (e) => { if (e.target === editModal) closeModal(); });

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  updateSeries(editId, {
    Titulo:     editTitle.value.trim(),
    Sinopsis:   editSinopsis.value.trim(),
    Comentario: editComentario.value.trim(),
  });
  closeModal();
});

// ── Guard de sesión ───────────────────────────────────────
// Si no hay usuario logueado, vuelve al login
onAuthChange((user) => {
  if (user) {
    app.style.display = "grid";
    initApp();
  } else {
    window.location.href = "login.html";
  }
});

// ── Logout ────────────────────────────────────────────────
btnLogout.addEventListener("click", () => logoutUser());

// ── App principal ─────────────────────────────────────────
function initApp() {
  onGetSeries((querySnapshot) => {
    let html = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      html += `
        <div class="card-tarea">
          <div class="card-banner"></div>
          <div class="card-body">
            <span class="card-badge">🎬 Serie</span>
            <h3>${task.Titulo}</h3>
            ${task.Sinopsis ? `<p><strong>Sinopsis</strong>${task.Sinopsis}</p>` : ""}
            ${task.Comentario ? `<p><strong>Reseña</strong>${task.Comentario}</p>` : ""}
          </div>
          <div class="card-botones">
            <button class="btn-delete" data-id="${doc.id}">Eliminar</button>
            <button class="btn-edit"   data-id="${doc.id}">Editar</button>
          </div>
        </div>
      `;
    });

    taskContainer.innerHTML = html;

    taskContainer.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        if (confirm("¿Estás seguro de eliminar esta serie?")) {
          deleteSeries(event.target.dataset.id);
        }
      });
    });

    taskContainer.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const docSnap = await getSeries(event.target.dataset.id);
        openModal(docSnap.data(), event.target.dataset.id);
      });
    });
  });
}

// ── Guardar / Modificar ───────────────────────────────────
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo     = taskForm["task-title"].value.trim();
  const sinopsis   = taskForm["sinopsis"].value.trim();
  const comentario = taskForm["comentario"].value.trim();

  if (!titulo) { alert("El título es obligatorio."); return; }

  saveSeries(titulo, sinopsis, comentario);
  taskForm.reset();
});

// ── Toggle formulario mobile ──────────────────────────────
open.addEventListener("click", () => {
  contenidoForm.style.display = "flex";
  open.style.display  = "none";
  close.style.display = "inline";
});

close.addEventListener("click", () => {
  contenidoForm.style.display = "none";
  open.style.display  = "inline";
  close.style.display = "none";
});
