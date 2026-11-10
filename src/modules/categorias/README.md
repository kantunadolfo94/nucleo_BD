# 🗂️ Módulo `categorias` — asignado a **Alexis**

Rama de trabajo: `categorias` (crear desde `main`).
Trabaja ÚNICAMENTE dentro de `src/modules/categorias/`.

## ¿Qué hace este módulo?

Administra las categorías de calzado de la tienda:
**Deportivos, Casuales, De vestir y Botas** (nombre, descripción e imagen).

## Tu contenido JSON sugerido

```json
{
  "nombre": "Deportivos",
  "descripcion": "Tenis para correr, entrenar y jugar.",
  "imagen": "/images/categoria-deportivos.svg"
}
```

## Pasos para desarrollarlo (copia el patrón de `productos`)

1. Crea en esta carpeta:
   - `types.ts` → interfaz `Categoria` + validaciones de nombre.
   - `service.ts` → clase `CategoriaService` con CRUD.
   - `routes.ts` → `export const categoriasRouter = Router();`
   - `demo.ts` → demostración completa en consola.

2. En tu servicio usa el repositorio compartido:

   ```ts
   import { ModuleRepository } from "../../core/ModuleRepository";

   const repo = new ModuleRepository<Categoria>(
     "categorias",
     process.env.AUTOR_CATEGORIAS ?? "Alexis",
   );
   ```

3. Pide al líder (Adolfo) que agregue en `src/server.ts`:

   ```ts
   import { categoriasRouter } from "./modules/categorias/routes";
   app.use("/api/categorias", categoriasRouter);
   ```

4. Agrega al `.env` (local): `AUTOR_CATEGORIAS=Alexis`

## Endpoints sugeridos

- `GET /api/categorias`
- `POST /api/categorias`
- `GET /api/categorias/buscar/:campo/:valor`
- `GET /api/categorias/:id`
- `PUT /api/categorias/:id`
- `DELETE /api/categorias/:id`

## Reglas

- ❌ NO modifiques `package.json`, `src/server.ts`, `src/core/`, `src/config/`, `src/db/` ni módulos de otros.
- ✅ SÍ usa `ModuleRepository` y la tabla compartida `records`.
- ✅ SÍ documenta tus cambios en el Pull Request.
