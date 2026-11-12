# 👞 Módulo `vestir` — asignado a **José Luis**

Rama de trabajo: `vestir` (crear desde `main`).
Trabaja ÚNICAMENTE dentro de `src/modules/vestir/`.

## ¿Qué hace este módulo?

Administra los productos de calzado de vestir de la tienda.

## Tu contenido JSON sugerido

```json
{
  "nombre": "Elegance Classic",
  "descripcion": "Zapato de vestir de piel, suela de cuero.",
  "categoria": "De vestir",
  "precio": 2599,
  "talla": 28,
  "existencia": 4
}
```

## Pasos para desarrollarlo (copia el patrón de `deportivos`)

1. Crea en esta carpeta:
   - `types.ts` → interfaz `ProductoVestir` + validaciones básicas.
   - `service.ts` → clase `VestirService` con CRUD.
   - `routes.ts` → `export const vestirRouter = Router();`
   - `demo.ts` → demostración completa en consola.

2. En tu servicio usa el repositorio compartido:

   ```ts
   import { ModuleRepository } from "../../core/ModuleRepository";

   const repo = new ModuleRepository<ProductoVestir>(
     "vestir",
     process.env.AUTOR_VESTIR ?? "Jose Luis",
   );
   ```

3. Pide al líder (Adolfo) que agregue en `src/server.ts`:

   ```ts
   import { vestirRouter } from "./modules/vestir/routes";
   app.use("/api/vestir", vestirRouter);
   ```

4. Agrega al `.env` (local): `AUTOR_VESTIR=Jose Luis`

## Endpoints sugeridos

- `GET /api/vestir`
- `POST /api/vestir`
- `GET /api/vestir/buscar/:campo/:valor`
- `GET /api/vestir/:id`
- `PUT /api/vestir/:id`
- `DELETE /api/vestir/:id`

## Reglas

- ❌ NO modifiques `package.json`, `src/server.ts`, `src/core/`, `src/config/`, `src/db/` ni módulos de otros.
- ✅ SÍ usa `ModuleRepository` y la tabla compartida `records`.
- ✅ SÍ documenta tus cambios en el Pull Request.
