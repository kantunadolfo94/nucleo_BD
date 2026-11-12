/**
 * SneakShop — Lógica de las Vistas de Módulo por Categoría
 * Administra la vista independiente de cada categoría:
 * carga de catálogo, búsqueda en tiempo real, registro de calzado y eliminación.
 */

(function () {
  "use strict";

  const main = document.getElementById("vista-modulo");
  if (!main) return;

  const modulo = main.dataset.modulo;
  const categoria = main.dataset.categoria;
  const autorDefecto = main.dataset.autor || "Equipo";
  const imagenDefecto = main.dataset.imagen || "/images/producto-placeholder.svg";

  // Elementos del DOM
  const catalogoEl = document.getElementById("catalogo-productos");
  const contadorEl = document.getElementById("contador-productos");
  const busquedaEl = document.getElementById("buscar-producto");
  const menu = document.getElementById("menu");
  const menuBoton = document.getElementById("menu-boton");

  // Modal y formulario
  const modal = document.getElementById("modal-nuevo-producto");
  const modalAbrirBtn = document.getElementById("btn-nuevo-producto");
  const modalCerrarBtn = document.getElementById("modal-cerrar");
  const form = document.getElementById("form-nuevo-producto");
  const alertaModal = document.getElementById("modal-alerta");

  let productosMemoria = [];

  /* ------------------------- Formateadores y utilidades ------------------------- */
  function formatoMoneda(valor) {
    const num = Number(valor);
    if (!Number.isFinite(num)) return "$0.00 MXN";
    return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  }

  function escaparHTML(texto) {
    if (texto === undefined || texto === null) return "";
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ------------------------- Notificaciones Toast ------------------------- */
  function mostrarToast(mensaje, tipo = "exito") {
    let contenedor = document.getElementById("toast-contenedor");
    if (!contenedor) {
      contenedor = document.createElement("div");
      contenedor.id = "toast-contenedor";
      contenedor.className = "toast-contenedor";
      document.body.appendChild(contenedor);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast--${tipo}`;
    const icono = tipo === "exito" ? "✓" : "⚠";
    toast.innerHTML = `<span>${icono}</span><span>${escaparHTML(mensaje)}</span>`;
    contenedor.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ------------------------- Menú móvil y Encabezado ------------------------- */
  function configurarNavegacion() {
    if (menu && menuBoton) {
      menuBoton.addEventListener("click", () => {
        const abierto = menu.classList.toggle("abierto");
        menuBoton.setAttribute("aria-expanded", String(abierto));
        menuBoton.textContent = abierto ? "✕" : "☰";
      });
    }

    const encabezado = document.getElementById("encabezado");
    if (encabezado) {
      window.addEventListener("scroll", () => {
        encabezado.classList.toggle("encabezado--scroll", window.scrollY > 20);
      });
    }
  }

  /* ------------------------- Renderizado del Catálogo ------------------------- */
  function renderizarCatalogo(lista) {
    if (!catalogoEl) return;

    if (contadorEl) {
      contadorEl.textContent = `${lista.length} ${lista.length === 1 ? "producto" : "productos"}`;
    }

    if (lista.length === 0) {
      const termino = busquedaEl ? busquedaEl.value.trim() : "";
      if (termino) {
        catalogoEl.innerHTML = `
          <div class="estado-mensaje">
            <div class="estado-mensaje__icono">🔍</div>
            <h3>Sin resultados</h3>
            <p>No se encontraron zapatos que coincidan con "<strong>${escaparHTML(termino)}</strong>".</p>
            <button class="boton boton--secundario" id="btn-limpiar-busqueda">Limpiar búsqueda</button>
          </div>
        `;
        const limpiarBtn = document.getElementById("btn-limpiar-busqueda");
        if (limpiarBtn) {
          limpiarBtn.addEventListener("click", () => {
            busquedaEl.value = "";
            renderizarCatalogo(productosMemoria);
          });
        }
      } else {
        catalogoEl.innerHTML = `
          <div class="estado-mensaje">
            <div class="estado-mensaje__icono">👟</div>
            <h3>Aún no hay productos en este módulo</h3>
            <p>Sé el primero en registrar un calzado en la categoría <strong>${escaparHTML(categoria)}</strong>.</p>
            <button class="boton boton--neon" onclick="document.getElementById('btn-nuevo-producto').click()">
              + Registrar primer calzado
            </button>
          </div>
        `;
      }
      return;
    }

    catalogoEl.innerHTML = lista
      .map((item) => {
        const p = item.content || {};
        const stock = Number(p.existencia ?? 0);
        const hayStock = stock > 0;
        const autor = item.autor || autorDefecto;
        const nombre = p.nombre || "Sin nombre";
        const descripcion = p.descripcion || "Sin descripción disponible.";
        const precio = formatoMoneda(p.precio ?? 0);
        const talla = p.talla !== undefined ? `Talla ${p.talla} MX` : "Talla estándar";

        return `
          <article class="tarjeta-producto" data-id="${escaparHTML(item.id)}">
            <div class="tarjeta-producto__imagen">
              <div class="tarjeta-producto__etiquetas">
                <span class="chip chip--categoria">${escaparHTML(p.categoria || categoria)}</span>
                <span class="chip ${hayStock ? "chip--stock-ok" : "chip--stock-cero"}">
                  ${hayStock ? `${stock} pares` : "Agotado"}
                </span>
              </div>
              <img src="${imagenDefecto}" alt="${escaparHTML(nombre)}" loading="lazy" />
            </div>

            <div class="tarjeta-producto__cuerpo">
              <h3 class="tarjeta-producto__titulo">${escaparHTML(nombre)}</h3>
              <p class="tarjeta-producto__desc">${escaparHTML(descripcion)}</p>

              <div class="tarjeta-producto__detalles">
                <span class="tarjeta-producto__precio">${precio}</span>
                <span class="tarjeta-producto__talla">${escaparHTML(talla)}</span>
              </div>

              <div class="tarjeta-producto__pie">
                <span class="tarjeta-producto__autor">👤 ${escaparHTML(autor)}</span>
                <button
                  type="button"
                  class="boton--peligro btn-eliminar"
                  data-id="${escaparHTML(item.id)}"
                  data-nombre="${escaparHTML(nombre)}"
                  title="Eliminar producto"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    // Conectar botones de eliminación
    catalogoEl.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const nombre = btn.dataset.nombre;
        eliminarProducto(id, nombre);
      });
    });
  }

  /* ------------------------- Carga de Datos desde API ------------------------- */
  async function cargarProductos() {
    if (!catalogoEl) return;
    catalogoEl.innerHTML = `
      <div class="estado-mensaje">
        <div class="estado-mensaje__icono">⏳</div>
        <h3>Cargando catálogo…</h3>
        <p>Consultando el módulo <code>/api/${escaparHTML(modulo)}</code></p>
      </div>
    `;

    try {
      const res = await fetch(`/api/${modulo}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      productosMemoria = Array.isArray(json.data) ? json.data : [];
      renderizarCatalogo(productosMemoria);
    } catch (err) {
      console.error(`[${modulo}] Error al cargar catálogo:`, err);
      catalogoEl.innerHTML = `
        <div class="estado-mensaje">
          <div class="estado-mensaje__icono">⚠️</div>
          <h3>Error al conectar con la API</h3>
          <p>No se pudo cargar la lista de productos de <code>/api/${escaparHTML(modulo)}</code>.</p>
          <button class="boton boton--secundario" id="btn-reintentar">Reintentar</button>
        </div>
      `;
      const reintentarBtn = document.getElementById("btn-reintentar");
      if (reintentarBtn) reintentarBtn.addEventListener("click", cargarProductos);
    }
  }

  /* ------------------------- Filtrado en tiempo real ------------------------- */
  function configurarBusqueda() {
    if (!busquedaEl) return;
    busquedaEl.addEventListener("input", (e) => {
      const termino = e.target.value.toLowerCase().trim();
      if (!termino) {
        renderizarCatalogo(productosMemoria);
        return;
      }
      const filtrados = productosMemoria.filter((item) => {
        const c = item.content || {};
        const nombre = (c.nombre || "").toLowerCase();
        const desc = (c.descripcion || "").toLowerCase();
        return nombre.includes(termino) || desc.includes(termino);
      });
      renderizarCatalogo(filtrados);
    });
  }

  /* ------------------------- Modal y Alta de Producto ------------------------- */
  function abrirModal() {
    if (!modal) return;
    limpiarAlertaModal();
    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    const primerInput = form ? form.querySelector("input:not([type=hidden])") : null;
    if (primerInput) primerInput.focus();
  }

  function cerrarModal() {
    if (!modal) return;
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    if (form) form.reset();
    limpiarAlertaModal();
  }

  function mostrarAlertaModal(mensaje, tipo = "error") {
    if (!alertaModal) return;
    alertaModal.className = `formulario-alerta formulario-alerta--${tipo}`;
    alertaModal.textContent = mensaje;
    alertaModal.style.display = "block";
  }

  function limpiarAlertaModal() {
    if (!alertaModal) return;
    alertaModal.textContent = "";
    alertaModal.style.display = "none";
  }

  function configurarModal() {
    if (modalAbrirBtn) modalAbrirBtn.addEventListener("click", abrirModal);
    if (modalCerrarBtn) modalCerrarBtn.addEventListener("click", cerrarModal);

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrarModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && modal.classList.contains("abierto")) {
        cerrarModal();
      }
    });

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        limpiarAlertaModal();

        const submitBtn = form.querySelector("button[type=submit]");
        const datos = {
          nombre: form.nombre.value.trim(),
          descripcion: form.descripcion.value.trim(),
          categoria: categoria,
          precio: Number(form.precio.value),
          talla: Number(form.talla.value),
          existencia: Number.parseInt(form.existencia.value, 10),
        };

        // Validaciones locales rápidas
        if (!datos.nombre || datos.nombre.length < 3) {
          mostrarAlertaModal("El nombre debe tener al menos 3 caracteres.");
          return;
        }
        if (!datos.descripcion || datos.descripcion.length < 5) {
          mostrarAlertaModal("La descripción debe tener al menos 5 caracteres.");
          return;
        }
        if (!Number.isFinite(datos.precio) || datos.precio <= 0) {
          mostrarAlertaModal("El precio debe ser un número mayor a 0.");
          return;
        }
        if (!Number.isFinite(datos.talla) || datos.talla < 18 || datos.talla > 45) {
          mostrarAlertaModal("La talla debe estar entre 18 y 45 MX.");
          return;
        }
        if (!Number.isInteger(datos.existencia) || datos.existencia < 0) {
          mostrarAlertaModal("La existencia debe ser un número entero mayor o igual a 0.");
          return;
        }

        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Guardando…";
          }

          const res = await fetch(`/api/${modulo}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
          });

          const cuerpo = await res.json();

          if (!res.ok) {
            const msj = cuerpo.errores ? cuerpo.errores.join(" ") : (cuerpo.mensaje || "Error al registrar producto.");
            mostrarAlertaModal(msj);
            return;
          }

          mostrarToast(`¡"${datos.nombre}" registrado exitosamente!`);
          cerrarModal();
          await cargarProductos();
        } catch (err) {
          mostrarAlertaModal("Error de red al guardar el producto. Intenta de nuevo.");
          console.error(`[${modulo}] Error en POST:`, err);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Guardar calzado";
          }
        }
      });
    }
  }

  /* ------------------------- Eliminación de Producto ------------------------- */
  async function eliminarProducto(id, nombre) {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/${modulo}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.mensaje || `HTTP ${res.status}`);
      }

      mostrarToast(`"${nombre}" ha sido eliminado.`);
      productosMemoria = productosMemoria.filter((p) => p.id !== id);
      renderizarCatalogo(productosMemoria);
    } catch (err) {
      console.error(`[${modulo}] Error al eliminar:`, err);
      mostrarToast(`No se pudo eliminar "${nombre}".`, "error");
    }
  }

  /* ------------------------- Inicialización ------------------------- */
  configurarNavegacion();
  configurarBusqueda();
  configurarModal();
  cargarProductos();
})();
