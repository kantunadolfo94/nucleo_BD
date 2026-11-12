/* ============================================================
   SneakShop — Lógica del frontend
   - Menú móvil (abrir/cerrar)
   - Año del pie de página
   ============================================================ */

const menu = document.getElementById("menu");
const menuBoton = document.getElementById("menu-boton");

/* ------------------------- Menú móvil ------------------------- */
function configurarMenu() {
  if (!menu || !menuBoton) return;
  menuBoton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    menuBoton.setAttribute("aria-expanded", String(abierto));
    menuBoton.textContent = abierto ? "✕" : "☰";
  });

  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menu.classList.remove("abierto");
      menuBoton.setAttribute("aria-expanded", "false");
      menuBoton.textContent = "☰";
    });
  });
}

/* ------------------------- Inicio ------------------------- */
function iniciar() {
  configurarMenu();
}

iniciar();
