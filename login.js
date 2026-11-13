import {
  registerUser,
  loginUser,
  onAuthChange,
} from "./Conexion123.js";

const authForm      = document.getElementById("auth-form");
const authEmail     = document.getElementById("auth-email");
const authPassword  = document.getElementById("auth-password");
const authBtn       = document.getElementById("auth-btn");
const authError     = document.getElementById("auth-error");
const authSubtitulo = document.getElementById("auth-subtitulo");
const authToggleBtn = document.getElementById("auth-toggle-btn");
const authToggleTxt = document.getElementById("auth-toggle-text");
const togglePass    = document.getElementById("toggle-password");

togglePass.addEventListener("click", () => {
  const visible = authPassword.type === "text";
  authPassword.type      = visible ? "password" : "text";
  togglePass.textContent = visible ? "👁" : "🚫";
});


let modoRegistro = false;

// Si ya hay sesión activa, ir directo al app
onAuthChange((user) => {
  if (user) {
    window.location.href = "index.html";
  }
});

// ── Toggle login / registro ───────────────────────────────
authToggleBtn.addEventListener("click", () => {
  modoRegistro = !modoRegistro;
  if (modoRegistro) {
    authBtn.textContent       = "Crear cuenta";
    authSubtitulo.textContent = "Creá tu cuenta para empezar";
    authToggleTxt.textContent = "¿Ya tenés cuenta?";
    authToggleBtn.textContent = "Iniciar sesión";
  } else {
    authBtn.textContent       = "Iniciar Sesión";
    authSubtitulo.textContent = "Ingresá tu cuenta para continuar";
    authToggleTxt.textContent = "¿No tenés cuenta?";
    authToggleBtn.textContent = "Crear cuenta";
  }
  authError.textContent = "";
});

// ── Submit ────────────────────────────────────────────────
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authError.textContent = "";

  const email    = authEmail.value.trim();
  const password = authPassword.value;

  if (!email || !password) {
    authError.textContent = "Completá email y contraseña.";
    return;
  }

  authBtn.disabled    = true;
  authBtn.textContent = "Cargando...";

  try {
    if (modoRegistro) {
      await registerUser(email, password);
    } else {
      await loginUser(email, password);
    }
    // onAuthChange detecta el login y redirige a index.html
  } catch (err) {
    console.error("Error de autenticación:", err);
    authError.textContent = traducirError(err.code);
    authBtn.disabled    = false;
    authBtn.textContent = modoRegistro ? "Crear cuenta" : "Iniciar Sesión";
  }
});

// ── Traducciones ──────────────────────────────────────────
function traducirError(code) {
  const errores = {
    "auth/invalid-email":        "El email no es válido.",
    "auth/user-not-found":       "No existe una cuenta con ese email.",
    "auth/wrong-password":       "Contraseña incorrecta.",
    "auth/email-already-in-use": "Ese email ya está registrado.",
    "auth/weak-password":        "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential":   "Email o contraseña incorrectos.",
    "auth/too-many-requests":    "Demasiados intentos. Intentá más tarde.",
  };
  return errores[code] || "Ocurrió un error. Intentá de nuevo.";
}
