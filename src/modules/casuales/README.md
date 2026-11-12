# 🗂️ Módulo `casuales` — asignado a **Alexis**

Rama de trabajo: `casuales` (crear desde `main`).
Trabaja ÚNICAMENTE dentro de `src/modules/casuales/`.

## ¿Qué hace este módulo?

Administra las categorías de calzado casual de la tienda (nombre, descripción e imagen).

## Tu contenido JSON sugerido

```json
{
  "nombre": "Casuales",
  "descripcion": "Zapatos casuales para el día a día.",
  "imagen": "/images/categoria-casuales.svg"
}
```

## Pasos para desarrollarlo (copia el patrón de `deportivos`)

1. Crea en esta carpeta:
   - `types.ts` → interfaz `Categoria` + validaciones de nombre.
   - `service.ts` → clase `CasualService` con CRUD.
   - `routes.ts` → `export const casualesRouter = Router();`
   - `demo.ts` → demostración completa en consola.

2. En tu servicio usa el repositorio compartido:

   ```ts
   import { ModuleRepository } from "../../core/ModuleRepository";

   const repo = new ModuleRepository<Categoria>(
     "casuales",
     process.env.AUTOR_CASUALES ?? "Alexis",
   );
   ```

3. Pide al líder (Adolfo) que agregue en `src/server.ts`:

   ```ts
   import { casualesRouter } from "./modules/casuales/routes";
   app.use("/api/casuales", casualesRouter);
   ```

4. Agrega al `.env` (local): `AUTOR_CASUALES=Alexis`

## Endpoints sugeridos

- `GET /api/casuales`
- `POST /api/casuales`
- `GET /api/casuales/buscar/:campo/:valor`
- `GET /api/casuales/:id`
- `PUT /api/casuales/:id`
- `DELETE /api/casuales/:id`

## Reglas

- ❌ NO modifiques `package.json`, `src/server.ts`, `src/core/`, `src/config/`, `src/db/` ni módulos de otros.
- ✅ SÍ usa `ModuleRepository` y la tabla compartida `records`.
- ✅ SÍ documenta tus cambios en el Pull Request.
