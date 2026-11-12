# 📦 Módulo `deportivos` — MÓDULO DE REFERENCIA (Adolfo)

Este módulo está **completo y funcionando**. Es el ejemplo oficial del proyecto:
los demás integrantes deben copiar este patrón en sus módulos
(`casuales`, `vestir`, `botas`).

## Archivos

| Archivo      | Responsabilidad |
|--------------|-----------------|
| `types.ts`   | Tipos TypeScript: qué campos tiene un producto y sus categorías válidas. |
| `service.ts` | Lógica de negocio: validaciones + CRUD usando `ModuleRepository`. |
| `routes.ts`  | Endpoints HTTP (Express Router) que usan el servicio. |
| `demo.ts`    | Demostración por consola de TODAS las operaciones (`npm run demo:deportivos`). |

## Datos de un producto

Cada producto se guarda como **JSON dentro de la columna `content`** de la tabla
compartida `records` (con `jsonb(?)` al guardar y `json(content)` al consultar):

```json
{
  "nombre": "Neon Runner X1",
  "descripcion": "Tenis de running con malla respirable y suela reactiva.",
  "categoria": "Deportivos",
  "precio": 2199,
  "talla": 27,
  "existencia": 10
}
```

Categorías válidas: `Deportivos`, `Casuales`, `De vestir`, `Botas`.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/deportivos` | Lista todos los productos. Admite `?categoria=Deportivos`. |
| POST   | `/api/deportivos` | Registra un producto (JSON en el cuerpo). |
| GET    | `/api/deportivos/buscar/:campo/:valor` | Filtra por propiedad JSON, ej. `/api/deportivos/buscar/categoria/Botas`. |
| GET    | `/api/deportivos/:id` | Consulta un producto por id. |
| PUT    | `/api/deportivos/:id` | Actualiza campos de un producto. |
| DELETE | `/api/deportivos/:id` | Elimina un producto. |

> Nota: en `/buscar/...` los valores con espacios deben ir codificados,
> por ejemplo `/api/deportivos/buscar/categoria/De%20vestir`.

## Ejemplos con curl

```bash
# Listar todos
curl http://localhost:3000/api/deportivos

# Registrar
curl -X POST http://localhost:3000/api/deportivos \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Neon Runner X1\",\"descripcion\":\"Tenis de running\",\"categoria\":\"Deportivos\",\"precio\":2199,\"talla\":27,\"existencia\":10}"

# Buscar por propiedad JSON
curl http://localhost:3000/api/deportivos/buscar/categoria/Deportivos

# Actualizar
curl -X PUT http://localhost:3000/api/deportivos/<ID> \
  -H "Content-Type: application/json" \
  -d "{\"precio\":1999}"

# Eliminar
curl -X DELETE http://localhost:3000/api/deportivos/<ID>
```

## Cómo probar la demo

```bash
npm run demo:deportivos
```

La demo ejecuta en orden: `create` (2 productos), `findAll`, `findById`,
`findByField`, `update` y `delete`, imprimiendo los resultados en consola.

## Cómo replicar este módulo (para los demás integrantes)

1. Crea `types.ts`, `service.ts`, `routes.ts` y `demo.ts` dentro de tu carpeta.
2. En tu servicio, instancia el repositorio con TU módulo y TU autor:

   ```ts
   this.repo = new ModuleRepository<MiContenido>("casuales", process.env.AUTOR_CASUALES);
   ```

3. Crea un `Router` y expórtalo.
4. **Pide al líder** que monte tu router en `src/server.ts`
   (ej. `app.use("/api/casuales", casualesRouter)`), porque
   `server.ts` es un archivo global protegido.
5. Agrega tu variable de autor al `.env` (local): `AUTOR_CASUALES=Alexis`
6. Escribe tu demo y pruébala con `npm run db:init` + tu demo.
