/**
 * Rutas HTTP del módulo `deportivos`.
 *
 * Endpoints:
 *   GET    /api/deportivos
 *   POST   /api/deportivos
 *   GET    /api/deportivos/buscar/:campo/:valor
 *   GET    /api/deportivos/:id
 *   PUT    /api/deportivos/:id
 *   DELETE /api/deportivos/:id
 *
 * IMPORTANTE: la ruta de búsqueda se registra ANTES de `/(:id)` para que
 * Express no confunda "buscar" con un id.
 */
import { Router, type NextFunction, type Request, type Response } from "express";
import { DeportivoService, DeportivoValidationError, validarProducto } from "./service";
import type { ProductoUpdate } from "./types";

export const deportivosRouter = Router();

/** Instancia única del servicio para todas las peticiones. */
const service = new DeportivoService();

/** Envuelve handlers asíncronos para reenviar los errores a Express. */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

// ---------------------------------------------------------------------------
// GET /api/deportivos  (lista todos; admite ?categoria=Deportivos como filtro)
// ---------------------------------------------------------------------------
deportivosRouter.get(
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
// POST /api/deportivos  (registra un producto)
// ---------------------------------------------------------------------------
deportivosRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const registro = await service.registrar(req.body ?? {});
    res.status(201).json({ ok: true, mensaje: "Producto registrado", data: registro });
  }),
);

// ---------------------------------------------------------------------------
// GET /api/deportivos/buscar/:campo/:valor  (filtra por una propiedad JSON)
// ---------------------------------------------------------------------------
deportivosRouter.get(
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
// GET /api/deportivos/:id
// ---------------------------------------------------------------------------
deportivosRouter.get(
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
// PUT /api/deportivos/:id
// ---------------------------------------------------------------------------
deportivosRouter.put(
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
// DELETE /api/deportivos/:id
// ---------------------------------------------------------------------------
deportivosRouter.delete(
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
deportivosRouter.use((error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof DeportivoValidationError) {
    res.status(400).json({ ok: false, errores: error.errores });
    return;
  }
  console.error("[deportivos] Error no controlado:", error);
  res.status(500).json({
    ok: false,
    mensaje: error instanceof Error ? error.message : "Error interno del módulo de deportivos",
  });
});
