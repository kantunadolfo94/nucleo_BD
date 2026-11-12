# 🥾 Módulo `botas` — asignado a **Kevin**

Rama de trabajo: `botas` (crear desde `main`).
Trabaja ÚNICAMENTE dentro de `src/modules/botas/`.

## ¿Qué hace este módulo?

Administra los productos de calzado tipo bota de la tienda.

## Tu contenido JSON sugerido

```json
{
  "nombre": "Shadow Boot 3000",
  "descripcion": "Bota resistente con suela antideslizante.",
  "categoria": "Botas",
  "precio": 2399,
  "talla": 28,
  "existencia": 6
}
```

## Pasos para desarrollarlo (copia el patrón de `deportivos`)

1. Crea en esta carpeta:
   - `types.ts` → interfaz `ProductoBota` + validaciones básicas.
   - `service.ts` → clase `BotaService` con CRUD.
   - `routes.ts` → `export const botasRouter = Router();`
   - `demo.ts` → demostración completa en consola.

2. En tu servicio usa el repositorio compartido:

   ```ts
   import { ModuleRepository } from "../../core/ModuleRepository";

   const repo = new ModuleRepository<ProductoBota>(
     "botas",
     process.env.AUTOR_BOTAS ?? "Kevin",
   );
   ```

3. Pide al líder (Adolfo) que agregue en `src/server.ts`:

   ```ts
   import { botasRouter } from "./modules/botas/routes";
   app.use("/api/botas", botasRouter);
   ```

4. Agrega al `.env` (local): `AUTOR_BOTAS=Kevin`

## Endpoints sugeridos

- `GET /api/botas`
- `POST /api/botas`
- `GET /api/botas/buscar/:campo/:valor`
- `GET /api/botas/:id`
- `PUT /api/botas/:id`
- `DELETE /api/botas/:id`

## Reglas

- ❌ NO modifiques `package.json`, `src/server.ts`, `src/core/`, `src/config/`, `src/db/` ni módulos de otros.
- ✅ SÍ usa `ModuleRepository` y la tabla compartida `records`.
- ✅ SÍ documenta tus cambios en el Pull Request.
