/* ============================================================
   SneakShop — Lógica del frontend
   - Menú móvil (abrir/cerrar)
   - Selección visual de categoría (botones)
   - Año del pie de página (si existe)
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

/* ------------------------- Botones de categoría ------------------------- */
function configurarCategorias() {
  document.querySelectorAll(".tarjeta-categoria").forEach((boton) => {
    boton.addEventListener("click", () => {
      document.querySelectorAll(".tarjeta-categoria").forEach((b) => b.classList.remove("activa"));
      boton.classList.add("activa");
    });
  });
}

/* ------------------------- Inicio ------------------------- */
function iniciar() {
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
  configurarMenu();
  configurarCategorias();
}

iniciar();
