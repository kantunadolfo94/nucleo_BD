/**
 * Rutas HTTP del módulo `casuales`.
 */
import { Router, type NextFunction, type Request, type Response } from "express";
import { CasualService, CasualValidationError } from "./service";
import type { ProductoUpdate } from "./types";

export const casualesRouter = Router();

const service = new CasualService();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

casualesRouter.get("/", asyncHandler(async (req, res) => {
  const categoria = typeof req.query.categoria === "string" ? req.query.categoria : "";
  const registros = categoria ? await service.filtrarPor("categoria", categoria) : await service.obtenerTodos();
  res.json({ ok: true, cantidad: registros.length, data: registros });
}));

casualesRouter.post("/", asyncHandler(async (req, res) => {
  const registro = await service.registrar(req.body ?? {});
  res.status(201).json({ ok: true, mensaje: "Producto registrado", data: registro });
}));

casualesRouter.get("/buscar/:campo/:valor", asyncHandler(async (req, res) => {
  const { campo, valor } = req.params;
  const valorCoercido = /^-?\d+(\.\d+)?$/.test(valor) ? Number(valor) : valor;
  const registros = await service.filtrarPor(campo, valorCoercido);
  res.json({ ok: true, campo, valor: valorCoercido, cantidad: registros.length, data: registros });
}));

casualesRouter.get("/:id", asyncHandler(async (req, res) => {
  const registro = await service.obtenerPorId(req.params.id);
  if (!registro) { res.status(404).json({ ok: false, mensaje: "Producto no encontrado" }); return; }
  res.json({ ok: true, data: registro });
}));

casualesRouter.put("/:id", asyncHandler(async (req, res) => {
  const cambios: ProductoUpdate = req.body ?? {};
  const registro = await service.actualizar(req.params.id, cambios);
  if (!registro) { res.status(404).json({ ok: false, mensaje: "Producto no encontrado" }); return; }
  res.json({ ok: true, mensaje: "Producto actualizado", data: registro });
}));

casualesRouter.delete("/:id", asyncHandler(async (req, res) => {
  const eliminado = await service.eliminar(req.params.id);
  if (!eliminado) { res.status(404).json({ ok: false, mensaje: "Producto no encontrado" }); return; }
  res.json({ ok: true, mensaje: "Producto eliminado" });
}));

casualesRouter.use((error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof CasualValidationError) {
    res.status(400).json({ ok: false, errores: error.errores });
    return;
  }
  console.error("[casuales] Error no controlado:", error);
  res.status(500).json({ ok: false, mensaje: error instanceof Error ? error.message : "Error interno del módulo casuales" });
});
