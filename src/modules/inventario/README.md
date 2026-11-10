# 🧮 Módulo `inventario` — asignado a **Kevin**

Rama de trabajo: `inventario` (crear desde `main`).
Trabaja ÚNICAMENTE dentro de `src/modules/inventario/`.

## ¿Qué hace este módulo?

Administra el control de stock: entradas, salidas y ajustes de existencia
por producto.

## Tu contenido JSON sugerido

```json
{
  "productoId": "uuid-del-producto",
  "tipo": "entrada",
  "cantidad": 5,
  "motivo": "Recepción de proveedor",
  "fecha": "2026-11-09"
}
```

## Pasos para desarrollarlo (copia el patrón de `productos`)

1. Crea en esta carpeta:
   - `types.ts` → interfaz `MovimientoInventario` + tipos `"entrada" | "salida" | "ajuste"`.
   - `service.ts` → clase `InventarioService` con CRUD.
   - `routes.ts` → `export const inventarioRouter = Router();`
   - `demo.ts` → demostración completa en consola.

2. En tu servicio usa el repositorio compartido:

   ```ts
   import { ModuleRepository } from "../../core/ModuleRepository";

   const repo = new ModuleRepository<MovimientoInventario>(
     "inventario",
     process.env.AUTOR_INVENTARIO ?? "Kevin",
   );
   ```

3. Pide al líder (Adolfo) que agregue en `src/server.ts`:

   ```ts
   import { inventarioRouter } from "./modules/inventario/routes";
   app.use("/api/inventario", inventarioRouter);
   ```

4. Agrega al `.env` (local): `AUTOR_INVENTARIO=Kevin`

## Endpoints sugeridos

- `GET /api/inventario`
- `POST /api/inventario`
- `GET /api/inventario/buscar/:campo/:valor` (ej. por `productoId` o `tipo`)
- `GET /api/inventario/:id`
- `PUT /api/inventario/:id`
- `DELETE /api/inventario/:id`

## Reglas

- ❌ NO modifiques `package.json`, `src/server.ts`, `src/core/`, `src/config/`, `src/db/` ni módulos de otros.
- ✅ SÍ usa `ModuleRepository` y la tabla compartida `records`.
- ✅ SÍ documenta tus cambios en el Pull Request.
