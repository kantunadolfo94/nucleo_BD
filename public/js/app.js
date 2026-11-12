/* ============================================================
   SneakShop — Lógica del frontend
   - Menú móvil (abrir/cerrar)
   - Selección de categoría → muestra el zapato de ejemplo (modal)
   ============================================================ */

const menu = document.getElementById("menu");
const menuBoton = document.getElementById("menu-boton");
const modal = document.getElementById("modal-categoria");
const modalCuerpo = document.getElementById("modal-cuerpo");
const modalCerrar = document.getElementById("modal-cerrar");

/** Mapeo de categoría → endpoint del módulo */
const ENDPOINTS_CATEGORIA = {
  "Deportivos": "/api/deportivos",
  "Casuales": "/api/casuales",
  "De vestir": "/api/vestir",
  "Botas": "/api/botas",
};

/** Imagen por categoría */
const IMAGENES_POR_CATEGORIA = {
  "Deportivos": "/images/categoria-deportivos.svg",
  "Casuales": "/images/categoria-casuales.svg",
  "De vestir": "/images/categoria-vestir.svg",
  "Botas": "/images/categoria-botas.svg",
};

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

/* ------------------------- Modal ------------------------- */
function abrirModal() {
  modal.classList.add("abierto");
  modal.setAttribute("aria-hidden", "false");
}

function cerrarModal() {
  modal.classList.remove("abierto");
  modal.setAttribute("aria-hidden", "true");
}

function configurarModal() {
  if (!modal) return;
  modalCerrar.addEventListener("click", cerrarModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("abierto")) cerrarModal();
  });
}

/* ------------------------- Botones de categoría ------------------------- */
function formatoPrecio(precio) {
  return Number(precio).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

async function mostrarZapatoDeCategoria(categoria) {
  const endpoint = ENDPOINTS_CATEGORIA[categoria];
  if (!endpoint) return;

  modalCuerpo.innerHTML = `<p class="cargando">Cargando zapato de ejemplo…</p>`;
  abrirModal();

  try {
    const respuesta = await fetch(endpoint);
    if (!respuesta.ok) throw new Error("Error al consultar la API");
    const cuerpo = await respuesta.json();
    const productos = cuerpo.data || [];

    if (productos.length === 0) {
      modalCuerpo.innerHTML = `
        <img src="${IMAGENES_POR_CATEGORIA[categoria]}" alt="${categoria}" />
        <h3>${categoria}</h3>
        <p class="descripcion">Aún no hay zapatos de ejemplo en esta categoría. Ejecuta la demo del módulo para cargar uno.</p>
      `;
      return;
    }

    const p = productos[0].content;
    const agotado = p.existencia <= 0;
    modalCuerpo.innerHTML = `
      <img src="${IMAGENES_POR_CATEGORIA[categoria]}" alt="${p.nombre}" />
      <h3>${p.nombre}</h3>
      <span class="etiqueta-categoria">${p.categoria}</span>
      <p class="descripcion">${p.descripcion}</p>
      <span class="precio">${formatoPrecio(p.precio)}</span>
      <span class="talla-existencia ${agotado ? "sin-existencia" : ""}">
        Talla ${p.talla} · ${agotado ? "Sin stock" : `${p.existencia} pares`}
      </span>
    `;
  } catch (error) {
    modalCuerpo.innerHTML = `
      <img src="${IMAGENES_POR_CATEGORIA[categoria]}" alt="${categoria}" />
      <h3>${categoria}</h3>
      <p class="descripcion">No se pudo cargar el zapato de ejemplo. Verifica que el servidor esté corriendo.</p>
    `;
  }
}

function configurarCategorias() {
  document.querySelectorAll(".tarjeta-categoria").forEach((boton) => {
    boton.addEventListener("click", () => {
      document.querySelectorAll(".tarjeta-categoria").forEach((b) => b.classList.remove("activa"));
      boton.classList.add("activa");
      mostrarZapatoDeCategoria(boton.dataset.categoria);
    });
  });
}

/* ------------------------- Inicio ------------------------- */
function iniciar() {
  configurarMenu();
  configurarModal();
  configurarCategorias();
}

iniciar();
