/* ============================================================
   SneakShop — Lógica de la Vista Principal (Inicio)
   - Control de navegación y menú móvil
   - Efecto scroll en encabezado
   - Carga dinámica de contadores para cada módulo
   ============================================================ */

(function () {
  "use strict";

  const menu = document.getElementById("menu");
  const menuBoton = document.getElementById("menu-boton");
  const encabezado = document.getElementById("encabezado");

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

  /* ------------------------- Scroll de encabezado ------------------------- */
  function configurarScroll() {
    if (!encabezado) return;
    window.addEventListener("scroll", () => {
      encabezado.classList.toggle("encabezado--scroll", window.scrollY > 20);
    });
  }

  /* ------------------------- Contadores de Módulos ------------------------- */
  const ENDPOINTS = {
    deportivos: "/api/deportivos",
    casuales: "/api/casuales",
    vestir: "/api/vestir",
    botas: "/api/botas",
  };

  async function cargarContadoresModulos() {
    for (const [modulo, url] of Object.entries(ENDPOINTS)) {
      const contador = document.querySelector(`[data-contador-modulo="${modulo}"]`);
      if (!contador) continue;

      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json();
        const total = Array.isArray(json.data) ? json.data.length : 0;
        contador.textContent = `${total} ${total === 1 ? "calzado" : "calzados"}`;
      } catch (err) {
        console.warn(`No se pudo cargar contador para ${modulo}:`, err);
      }
    }
  }

  /* ------------------------- Inicio ------------------------- */
  function iniciar() {
    configurarMenu();
    configurarScroll();
    cargarContadoresModulos();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
