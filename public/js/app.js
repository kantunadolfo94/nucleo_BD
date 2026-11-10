/* ============================================================
   SneakShop — Lógica del frontend (tema oscuro)
   - Consume la API del módulo productos (/api/productos)
   - Renderiza el catálogo destacado con etiquetas de estado
   - Filtra por categoría y buscador en vivo
   ============================================================ */

const API_PRODUCTOS = "/api/productos";

/** Imagen por categoría (puedes reemplazarlas por fotos reales en /images). */
const IMAGENES_POR_CATEGORIA = {
  "Deportivos": "/images/categoria-deportivos.svg",
  "Casuales": "/images/categoria-casuales.svg",
  "De vestir": "/images/categoria-vestir.svg",
  "Botas": "/images/categoria-botas.svg",
};
const IMAGEN_GENERICA = "/images/producto-placeholder.svg";

/** Estado local de la página. */
const estado = {
  productos: [],
  categoriaFiltro: null,
  texto: "",
};

/* ------------------------- Referencias del DOM ------------------------- */
const grid = document.getElementById("grid-productos");
const aviso = document.getElementById("aviso-api");
const subtitulo = document.getElementById("productos-subtitulo");
const botonLimpiarFiltro = document.getElementById("boton-limpiar-filtro");
const formBusqueda = document.getElementById("form-busqueda");
const inputBusqueda = document.getElementById("input-busqueda");
const menu = document.getElementById("menu");
const menuBoton = document.getElementById("menu-boton");
const encabezado = document.getElementById("encabezado");

/* ------------------------- Utilidades ------------------------- */

/** Formatea un número como moneda mexicana: 1899 -> $1,899.00 */
function formatoPrecio(precio) {
  return Number(precio).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

/** Devuelve la imagen correspondiente a la categoría del producto. */
function imagenDe(producto) {
  return IMAGENES_POR_CATEGORIA[producto.categoria] || IMAGEN_GENERICA;
}

/** Etiqueta de estado según la existencia. */
function etiquetaDeEstado(producto) {
  if (producto.existencia <= 0) {
    return `<span class="etiqueta-estado etiqueta-estado--urgente">AGOTADO</span>`;
  }
  if (producto.existencia <= 3) {
    return `<span class="etiqueta-estado etiqueta-estado--urgente">ÚLTIMAS PIEZAS</span>`;
  }
  return `<span class="etiqueta-estado">NUEVO DROP</span>`;
}

/** Muestra un aviso visible (ej. API caída, sin productos). */
function mostrarAviso(mensaje) {
  aviso.textContent = mensaje;
  aviso.classList.remove("oculto");
}

function ocultarAviso() {
  aviso.classList.add("oculto");
}

/* ------------------------- Render del catálogo ------------------------- */

/** Productos que cumplen el filtro de categoría y el texto de búsqueda. */
function productosVisibles() {
  return estado.productos.filter((p) => {
    const coincideCategoria = !estado.categoriaFiltro || p.categoria === estado.categoriaFiltro;
    const texto = estado.texto.trim().toLowerCase();
    const coincideTexto =
      !texto ||
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto);
    return coincideCategoria && coincideTexto;
  });
}

/** Crea el HTML de una tarjeta de producto. */
function crearTarjetaProducto(producto) {
  const agotado = producto.existencia <= 0;
  return `
    <article class="tarjeta-producto">
      <div class="tarjeta-producto__imagen">
        <img src="${imagenDe(producto)}" alt="Imagen de ${producto.nombre}" loading="lazy" />
        ${etiquetaDeEstado(producto)}
      </div>
      <div class="tarjeta-producto__cuerpo">
        <div class="tarjeta-producto__encabezado">
          <h3>${producto.nombre}</h3>
          <span class="etiqueta-categoria">${producto.categoria}</span>
        </div>
        <p class="tarjeta-producto__descripcion">${producto.descripcion}</p>
        <div class="tarjeta-producto__pie">
          <span class="precio">${formatoPrecio(producto.precio)}</span>
          <span class="talla-existencia ${agotado ? "sin-existencia" : ""}">
            Talla ${producto.talla} · ${agotado ? "Sin stock" : `${producto.existencia} pares`}
          </span>
        </div>
      </div>
    </article>
  `;
}

/** Dibuja las tarjetas según el estado actual. */
function renderProductos() {
  const visibles = productosVisibles();

  if (estado.categoriaFiltro && !estado.texto) {
    subtitulo.textContent = `Resultados en la categoría: ${estado.categoriaFiltro}`;
  } else if (estado.texto) {
    subtitulo.textContent = `Resultados de búsqueda: "${estado.texto}"`;
  } else {
    subtitulo.textContent = "Directo desde nuestra base de datos";
  }

  if (visibles.length === 0) {
    grid.innerHTML = `
      <p class="cargando">
        😕 No hay productos que coincidan.<br />
        Si la base de datos está vacía, puedes cargar la demo con:
        <code>npm run demo:productos</code>
      </p>`;
    return;
  }

  grid.innerHTML = visibles.map(crearTarjetaProducto).join("");
}

/** Descarga los productos desde la API del backend. */
async function cargarProductos() {
  try {
    const respuesta = await fetch(API_PRODUCTOS);
    if (!respuesta.ok) {
      throw new Error(`La API respondió con el estado ${respuesta.status}`);
    }
    const cuerpo = await respuesta.json();
    estado.productos = (cuerpo.data || []).map((registro) => registro.content);

    if (estado.productos.length === 0) {
      mostrarAviso(
        "El catálogo está vacío. Ejecuta la demo del módulo de productos con: npm run demo:productos",
      );
    } else {
      ocultarAviso();
    }
    renderProductos();
  } catch (error) {
    console.error("No se pudo cargar el catálogo:", error);
    mostrarAviso(
      "No se pudo conectar con la API de productos. Verifica que el servidor esté corriendo (npm run dev) y que las credenciales de Turso estén configuradas en .env.",
    );
    grid.innerHTML = `<p class="cargando">Sin conexión con el servidor de productos.</p>`;
  }
}

/* ------------------------- Búsqueda ------------------------- */

function configurarBuscador() {
  // Filtra mientras se escribe (búsqueda en vivo).
  inputBusqueda.addEventListener("input", () => {
    estado.texto = inputBusqueda.value;
    renderProductos();
  });

  formBusqueda.addEventListener("submit", (evento) => {
    evento.preventDefault();
    estado.texto = inputBusqueda.value;
    renderProductos();
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
  });
}

/* ------------------------- Categorías ------------------------- */

function configurarCategorias() {
  document.querySelectorAll(".tarjeta-categoria").forEach((tarjeta) => {
    const activar = () => {
      const categoria = tarjeta.dataset.categoria;

      // Si ya estaba activa, se quita el filtro.
      if (estado.categoriaFiltro === categoria) {
        estado.categoriaFiltro = null;
        tarjeta.classList.remove("activa");
      } else {
        estado.categoriaFiltro = categoria;
        document
          .querySelectorAll(".tarjeta-categoria")
          .forEach((t) => t.classList.toggle("activa", t === tarjeta));
      }

      botonLimpiarFiltro.classList.toggle("oculto", !estado.categoriaFiltro);
      renderProductos();
      document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
    };

    tarjeta.addEventListener("click", activar);
    tarjeta.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        activar();
      }
    });
  });

  botonLimpiarFiltro.addEventListener("click", () => {
    estado.categoriaFiltro = null;
    botonLimpiarFiltro.classList.add("oculto");
    document
      .querySelectorAll(".tarjeta-categoria")
      .forEach((t) => t.classList.remove("activa"));
    renderProductos();
  });
}

/* ------------------------- Menú móvil ------------------------- */

function configurarMenu() {
  menuBoton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    menuBoton.setAttribute("aria-expanded", String(abierto));
    menuBoton.textContent = abierto ? "✕" : "☰";
  });

  // Cierra el menú al elegir una sección.
  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menu.classList.remove("abierto");
      menuBoton.setAttribute("aria-expanded", "false");
      menuBoton.textContent = "☰";
    });
  });
}

/* ------------------------- Sombra del encabezado ------------------------- */

function configurarEncabezado() {
  window.addEventListener("scroll", () => {
    encabezado.classList.toggle("encabezado--scroll", window.scrollY > 10);
  });
}

/* ------------------------- Inicio ------------------------- */

function iniciar() {
  document.getElementById("anio").textContent = new Date().getFullYear();
  configurarBuscador();
  configurarCategorias();
  configurarMenu();
  configurarEncabezado();
  cargarProductos();
}

iniciar();
