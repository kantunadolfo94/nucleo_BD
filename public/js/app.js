/* ============================================================
   SneakShop — Lógica del frontend
   - Cada categoría tiene su URL: /Deportivos, /Casuales, /De%20vestir, /Botas
   - Al abrir una URL de categoría se muestra el zapato de ejemplo (modal)
   - Menú móvil
   ============================================================ */

const ENDPOINTS_CATEGORIA = {
  "Deportivos": "/api/deportivos",
  "Casuales": "/api/casuales",
  "De vestir": "/api/vestir",
  "Botas": "/api/botas",
};

const IMAGENES_POR_CATEGORIA = {
  "Deportivos": "/images/categoria-deportivos.svg",
  "Casuales": "/images/categoria-casuales.svg",
  "De vestir": "/images/categoria-vestir.svg",
  "Botas": "/images/categoria-botas.svg",
};

const menu = document.getElementById("menu");
const menuBoton = document.getElementById("menu-boton");
const modal = document.getElementById("modal-categoria");
const modalCuerpo = document.getElementById("modal-cuerpo");
const modalCerrar = document.getElementById("modal-cerrar");

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
  // Volver a la página principal sin recargar
  if (window.location.pathname !== "/") {
    history.pushState({}, "", "/");
  }
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

/* ------------------------- Categoría activa ------------------------- */
function categoriaDesdeURL() {
  const path = decodeURIComponent(window.location.pathname).replace(/^\/+/, "");
  return ["Deportivos", "Casuales", "De vestir", "Botas"].includes(path) ? path : null;
}

function marcarCategoriaActiva(categoria) {
  document.querySelectorAll(".tarjeta-categoria").forEach((el) => {
    el.classList.toggle("activa", el.dataset.categoria === categoria);
  });
}

/* ------------------------- Zapato de ejemplo ------------------------- */
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
        <p class="descripcion">Aún no hay zapatos de ejemplo en esta categoría.</p>
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
      <p class="descripcion">No se pudo cargar el zapato de ejemplo.</p>
    `;
  }
}

/* ------------------------- Inicio ------------------------- */
function iniciar() {
  const categoriaURL = categoriaDesdeURL();
  marcarCategoriaActiva(categoriaURL);

  if (categoriaURL) {
    mostrarZapatoDeCategoria(categoriaURL);
  }

  configurarMenu();
  configurarModal();

  // Navegación con el botón atrás/adelante del navegador
  window.addEventListener("popstate", () => {
    const cat = categoriaDesdeURL();
    marcarCategoriaActiva(cat);
    if (cat) {
      mostrarZapatoDeCategoria(cat);
    } else {
      cerrarModal();
    }
  });
}

iniciar();
