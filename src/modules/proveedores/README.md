# 🚚 Módulo `proveedores` — asignado a **José Luis**

Rama de trabajo: `proveedores` (crear desde `main`).
Trabaja ÚNICAMENTE dentro de `src/modules/proveedores/`.

## ¿Qué hace este módulo?

Administra los proveedores de calzado de la tienda: contacto, marca y
productos que surten.

## Tu contenido JSON sugerido

```json
{
  "nombre": "Calzado del Norte",
  "contacto": "ventas@calzadonorte.com",
  "telefono": "81-0000-0000",
  "marca": "Velocix",
  "categoriaSuministrada": "Deportivos"
}
```

## Pasos para desarrollarlo (copia el patrón de `productos`)

1. Crea en esta carpeta:
   - `types.ts` → interfaz `Proveedor` + validaciones básicas.
   - `service.ts` → clase `ProveedorService` con CRUD.
   - `routes.ts` → `export const proveedoresRouter = Router();`
   - `demo.ts` → demostración completa en consola.

2. En tu servicio usa el repositorio compartido:

   ```ts
   import { ModuleRepository } from "../../core/ModuleRepository";

   const repo = new ModuleRepository<Proveedor>(
     "proveedores",
     process.env.AUTOR_PROVEEDORES ?? "Jose Luis",
   );
   ```

3. Pide al líder (Adolfo) que agregue en `src/server.ts`:

   ```ts
   import { proveedoresRouter } from "./modules/proveedores/routes";
   app.use("/api/proveedores", proveedoresRouter);
   ```

4. Agrega al `.env` (local): `AUTOR_PROVEEDORES=Jose Luis`

## Endpoints sugeridos

- `GET /api/proveedores`
- `POST /api/proveedores`
- `GET /api/proveedores/buscar/:campo/:valor` (ej. por `marca` o `categoriaSuministrada`)
- `GET /api/proveedores/:id`
- `PUT /api/proveedores/:id`
- `DELETE /api/proveedores/:id`

## Reglas

- ❌ NO modifiques `package.json`, `src/server.ts`, `src/core/`, `src/config/`, `src/db/` ni módulos de otros.
- ✅ SÍ usa `ModuleRepository` y la tabla compartida `records`.
- ✅ SÍ documenta tus cambios en el Pull Request.
