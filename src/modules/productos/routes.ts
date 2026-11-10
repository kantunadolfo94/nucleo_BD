/**
 * Rutas HTTP del módulo `productos`.
 *
 * Endpoints:
 *   GET    /api/productos
 *   POST   /api/productos
 *   GET    /api/productos/buscar/:campo/:valor
 *   GET    /api/productos/:id
 *   PUT    /api/productos/:id
 *   DELETE /api/productos/:id
 *
 * IMPORTANTE: la ruta de búsqueda se registra ANTES de `/(:id)` para que
 * Express no confunda "buscar" con un id.
 */
import { Router, type NextFunction, type Request, type Response } from "express";
import { ProductoService, ProductoValidationError, validarProducto } from "./service";
import type { ProductoUpdate } from "./types";

export const productosRouter = Router();

/** Instancia única del servicio para todas las peticiones. */
const service = new ProductoService();

/** Envuelve handlers asíncronos para reenviar los errores a Express. */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

// ---------------------------------------------------------------------------
// GET /api/productos  (lista todos; admite ?categoria=Deportivos como filtro)
// ---------------------------------------------------------------------------
productosRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const categoria = typeof req.query.categoria === "string" ? req.query.categoria : "";
    const registros = categoria
      ? await service.filtrarPor("categoria", categoria)
      : await service.obtenerTodos();
    res.json({ ok: true, cantidad: registros.length, data: registros });
  }),
);

// ---------------------------------------------------------------------------
// POST /api/productos  (registra un producto)
// ---------------------------------------------------------------------------
productosRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const registro = await service.registrar(req.body ?? {});
    res.status(201).json({ ok: true, mensaje: "Producto registrado", data: registro });
  }),
);

// ---------------------------------------------------------------------------
// GET /api/productos/buscar/:campo/:valor  (filtra por una propiedad JSON)
// ---------------------------------------------------------------------------
productosRouter.get(
  "/buscar/:campo/:valor",
  asyncHandler(async (req, res) => {
    const { campo, valor } = req.params;

    // Si el valor es numérico (ej. talla o precio) se convierte para
    // que la comparación en la base de datos funcione.
    const valorCoercido = /^-?\d+(\.\d+)?$/.test(valor) ? Number(valor) : valor;

    const registros = await service.filtrarPor(campo, valorCoercido);
    res.json({ ok: true, campo, valor: valorCoercido, cantidad: registros.length, data: registros });
  }),
);

// ---------------------------------------------------------------------------
// GET /api/productos/:id
// ---------------------------------------------------------------------------
productosRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const registro = await service.obtenerPorId(req.params.id);
    if (!registro) {
      res.status(404).json({ ok: false, mensaje: "Producto no encontrado" });
      return;
    }
    res.json({ ok: true, data: registro });
  }),
);

// ---------------------------------------------------------------------------
// PUT /api/productos/:id
// ---------------------------------------------------------------------------
productosRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const cambios: ProductoUpdate = req.body ?? {};
    const registro = await service.actualizar(req.params.id, cambios);
    if (!registro) {
      res.status(404).json({ ok: false, mensaje: "Producto no encontrado" });
      return;
    }
    res.json({ ok: true, mensaje: "Producto actualizado", data: registro });
  }),
);

// ---------------------------------------------------------------------------
// DELETE /api/productos/:id
// ---------------------------------------------------------------------------
productosRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const eliminado = await service.eliminar(req.params.id);
    if (!eliminado) {
      res.status(404).json({ ok: false, mensaje: "Producto no encontrado" });
      return;
    }
    res.json({ ok: true, mensaje: "Producto eliminado" });
  }),
);

// ---------------------------------------------------------------------------
// Manejador de errores del router:
//  - Errores de validación  -> HTTP 400 con lista de errores
//  - Cualquier otro error   -> HTTP 500 (ej. sin conexión a Turso)
// ---------------------------------------------------------------------------
productosRouter.use((error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof ProductoValidationError) {
    res.status(400).json({ ok: false, errores: error.errores });
    return;
  }
  console.error("[productos] Error no controlado:", error);
  res.status(500).json({
    ok: false,
    mensaje: error instanceof Error ? error.message : "Error interno del módulo de productos",
  });
});
