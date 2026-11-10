# 📦 Módulo `productos` — MÓDULO DE REFERENCIA (Adolfo)

Este módulo está **completo y funcionando**. Es el ejemplo oficial del proyecto:
los demás integrantes deben copiar este patrón en sus módulos
(`categorias`, `inventario`, `proveedores`).

## Archivos

| Archivo      | Responsabilidad |
|--------------|-----------------|
| `types.ts`   | Tipos TypeScript: qué campos tiene un producto y sus categorías válidas. |
| `service.ts` | Lógica de negocio: validaciones + CRUD usando `ModuleRepository`. |
| `routes.ts`  | Endpoints HTTP (Express Router) que usan el servicio. |
| `demo.ts`    | Demostración por consola de TODAS las operaciones (`npm run demo:productos`). |

## Datos de un producto

Cada producto se guarda como **JSON dentro de la columna `content`** de la tabla
compartida `records` (con `jsonb(?)` al guardar y `json(content)` al consultar):

```json
{
  "nombre": "Velocix Runner 2",
  "descripcion": "Tenis ligeros para correr con suela amortiguada.",
  "categoria": "Deportivos",
  "precio": 1899,
  "talla": 27,
  "existencia": 12
}
```

Categorías válidas: `Deportivos`, `Casuales`, `De vestir`, `Botas`.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/productos` | Lista todos los productos. Admite `?categoria=Deportivos`. |
| POST   | `/api/productos` | Registra un producto (JSON en el cuerpo). |
| GET    | `/api/productos/buscar/:campo/:valor` | Filtra por propiedad JSON, ej. `/api/productos/buscar/categoria/Botas`. |
| GET    | `/api/productos/:id` | Consulta un producto por id. |
| PUT    | `/api/productos/:id` | Actualiza campos de un producto. |
| DELETE | `/api/productos/:id` | Elimina un producto. |

> Nota: en `/buscar/...` los valores con espacios deben ir codificados,
> por ejemplo `/api/productos/buscar/categoria/De%20vestir`.

## Ejemplos con curl

```bash
# Listar todos
curl http://localhost:3000/api/productos

# Registrar
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Velocix Runner 2\",\"descripcion\":\"Tenis ligeros para correr\",\"categoria\":\"Deportivos\",\"precio\":1899,\"talla\":27,\"existencia\":12}"

# Buscar por propiedad JSON
curl http://localhost:3000/api/productos/buscar/categoria/Deportivos

# Actualizar
curl -X PUT http://localhost:3000/api/productos/<ID> \
  -H "Content-Type: application/json" \
  -d "{\"precio\":1699}"

# Eliminar
curl -X DELETE http://localhost:3000/api/productos/<ID>
```

## Cómo probar la demo

```bash
npm run demo:productos
```

La demo ejecuta en orden: `create` (2 productos), `findAll`, `findById`,
`findByField`, `update` y `delete`, imprimiendo los resultados en consola.

## Cómo replicar este módulo (para los demás integrantes)

1. Crea `types.ts`, `service.ts`, `routes.ts` y `demo.ts` dentro de tu carpeta.
2. En tu servicio, instancia el repositorio con TU módulo y TU autor:

   ```ts
   this.repo = new ModuleRepository<MiContenido>("inventario", process.env.AUTOR_INVENTARIO);
   ```

3. Crea un `Router` y expórtalo.
4. **Pide al líder** que monte tu router en `src/server.ts`
   (ej. `app.use("/api/inventario", inventarioRouter)`), porque
   `server.ts` es un archivo global protegido.
5. Agrega tu variable de autor al `.env` (ej. `AUTOR_INVENTARIO=Kevin`).
6. Escribe tu demo y pruébala con `npm run db:init` + tu demo.
