# 👟 SneakShop

**Encuentra tu estilo en cada paso.**

SneakShop es una tienda web sencilla de calzado **deportivo, casual y de vestir**,
desarrollada por un equipo de 4 integrantes con **Git/GitHub** (una rama por
integrante), **Pull Requests** y una base de datos **Turso (libSQL)** compartida.

---

## 📋 Descripción del proyecto

- **Frontend**: página estática en `public/` (HTML5 + CSS3 + JavaScript puro) con presentación y categorías.
- **Backend**: API REST con **Node.js + TypeScript + Express** (`src/`).
- **Base de datos**: **Turso/libSQL**, con una única tabla compartida `records`
  para todos los módulos (JSONB).
- **Arquitectura modular**: cada integrante desarrolla su módulo dentro de
  `src/modules/<modulo>/` apoyándose en un repositorio genérico común
  (`ModuleRepository`).

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js, TypeScript, Express |
| Base de datos | Turso (libSQL) |
| Conexión BD | `@libsql/client` |
| Variables de entorno | `dotenv` |
| Ejecución TS | `tsx` |
| Versionado | Git y GitHub |

## 📁 Estructura del proyecto

```
SneakShop/
├── public/                  # Frontend (servido por Express)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js
│   └── images/              # Logotipo, hero e imágenes por categoría (SVG)
├── src/
│   ├── config/database.ts   # Conexión compartida a Turso (@libsql/client)
│   ├── core/ModuleRepository.ts  # Repositorio genérico reutilizable
│   ├── db/init.ts           # Crea la tabla 'records' y sus índices
│   ├── modules/
│   │   ├── productos/       # MÓDULO DE REFERENCIA (Adolfo) — completo
│   │   │   ├── types.ts
│   │   │   ├── service.ts
│   │   │   ├── routes.ts
│   │   │   ├── demo.ts
│   │   │   └── README.md
│   │   ├── categorias/      # Alexis (ver README del módulo)
│   │   ├── inventario/      # Kevin (ver README del módulo)
│   │   └── proveedores/     # José Luis (ver README del módulo)
│   └── server.ts            # Express: frontend + API
├── .github/pull_request_template.md
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Requisitos previos

- Node.js 18 o superior
- Una base de datos en [Turso](https://turso.tech) (gratis) y el [CLI de Turso](https://docs.turso.tech/cli/installation) instalado

## 📥 Instalación de dependencias

```bash
npm install
```

## 🔐 Configuración de Turso

1. Crea una base de datos en Turso:

   ```bash
   turso db create sneakshop
   turso db show sneakshop --url        # copia la URL (libsql://...)
   turso db tokens create sneakshop     # copia el token
   ```

2. Copia el ejemplo de variables de entorno y edítalo:

   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env
   ```

3. Completa en `.env`:

   ```env
   TURSO_DATABASE_URL=libsql://sneakshop-<tu-usuario>.turso.io
   TURSO_AUTH_TOKEN=eyJ...tu-token...
   PORT=3000
   AUTOR_PRODUCTOS=Adolfo
   ```

> ⚠️ **Nunca escribas credenciales reales en el código ni subas el `.env` a GitHub.**
> El archivo `.gitignore` ya lo excluye.

> 💡 **Pruebas locales sin Turso (opcional):** `@libsql/client` también abre
> bases locales. Puedes usar `TURSO_DATABASE_URL=file:local.db` en tu `.env`
> para probar todo sin conexión (el archivo se ignora por Git).

## 🗄️ Inicialización de la base de datos

```bash
npm run db:init
```

Crea la tabla compartida `records` y sus índices (es seguro ejecutarlo varias veces):

```sql
CREATE TABLE IF NOT EXISTS records (
  id         TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  autor      TEXT NOT NULL,
  modulo     TEXT NOT NULL,
  content    BLOB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_records_modulo ON records (modulo);
CREATE INDEX IF NOT EXISTS idx_records_autor  ON records (autor);
```

**JSONB**: cada módulo guarda su contenido como JSON en `content`:

- Al guardar → `INSERT ... VALUES (?, ?, ?, jsonb(?))`
- Al consultar → `SELECT id, created_at, autor, modulo, json(content) AS content ...`

No se crea una tabla por módulo: todos comparten `records` y se distinguen por
la columna `modulo`.

## ▶️ Ejecución local

```bash
# Modo desarrollo (reinicia solo al guardar cambios)
npm run dev

# Modo producción
npm run build
npm start
```

Abre `http://localhost:3000` para ver la tienda.
Endpoint de salud: `http://localhost:3000/api/health`

### API del módulo productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/productos` | Lista productos (admite `?categoria=Deportivos`) |
| POST   | `/api/productos` | Registra producto |
| GET    | `/api/productos/buscar/:campo/:valor` | Filtra por propiedad JSON |
| GET    | `/api/productos/:id` | Consulta por id |
| PUT    | `/api/productos/:id` | Actualiza producto |
| DELETE | `/api/productos/:id` | Elimina producto |

## 📜 Scripts disponibles

| Comando | Acción |
|---------|--------|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor en modo desarrollo |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el código compilado |
| `npm run db:init` | Crea la tabla `records` y sus índices |
| `npm run demo:productos` | Demo CRUD del módulo productos en consola |

## 🧩 ModuleRepository (`src/core/ModuleRepository.ts`)

Clase genérica y reutilizable que todos los módulos usan. Recibe
`modulo` y `autor`, e **inyecta ambos automáticamente** en cada registro.

| Método | Descripción |
|--------|-------------|
| `create(data)` | Inserta un registro nuevo; genera el `id` y agrega `autor` + `modulo`. |
| `findAll()` | Devuelve todos los registros del módulo (más recientes primero). |
| `findById(id)` | Busca un registro por id dentro del módulo. |
| `findByField(jsonKey, value)` | Filtra por una propiedad del JSON (igualdad exacta). |
| `update(id, data)` | Actualiza el JSON mezclando los campos enviados. |
| `delete(id)` | Elimina el registro; devuelve `true` si se eliminó. |

Ejemplo de uso:

```ts
import { ModuleRepository } from "../../core/ModuleRepository";

const repo = new ModuleRepository<Producto>("productos", "Adolfo");

await repo.create({ nombre: "Velocix", descripcion: "Tenis de correr",
                    categoria: "Deportivos", precio: 1899, talla: 27, existencia: 12 });
await repo.findAll();
await repo.findByField("categoria", "Deportivos");
```

## 🌿 Distribución de ramas y responsabilidades

| Rama | Integrante | Módulo | Carpeta de trabajo |
|------|-----------|--------|--------------------|
| `main` | Adolfo (líder) | Integración | — |
| `productos` | Adolfo | productos (referencia) | `src/modules/productos/` |
| `categorias` | Alexis | categorias | `src/modules/categorias/` |
| `inventario` | Kevin | inventario | `src/modules/inventario/` |
| `proveedores` | José Luis | proveedores | `src/modules/proveedores/` |

**Reglas de oro:**

1. Cada integrante trabaja únicamente dentro de su carpeta de módulo.
2. Nadie modifica `package.json`, `src/server.ts`, `src/core/`, `src/config/`,
   `src/db/` ni módulos ajenos **sin autorización del líder**.
3. Si necesitas que tu router se monte en `server.ts` o una dependencia nueva,
   pídelo en tu Pull Request.

## 🔀 Procedimiento para Pull Requests

```bash
# 1. Sincroniza main y crea tu rama (el nombre coincide con tu módulo)
git checkout main
git pull origin main
git checkout -b categorias

# 2. Desarrolla y haz commits descriptivos
git add src/modules/categorias
git commit -m "feat(categorias): CRUD completo con ModuleRepository"

# 3. Sube tu rama
git push -u origin categorias
```

4. Abre el Pull Request en GitHub (`main` ← tu rama).
5. Llena la plantilla automática (`.github/pull_request_template.md`):
   describe cambios, cómo probarlo y marca el checklist.
6. El líder revisa, deja comentarios si hace falta y aprueba el merge a `main`.

## ✅ Estado actual y pendientes

- [x] Estructura del proyecto completa
- [x] Conexión a Turso con `@libsql/client` + `dotenv`
- [x] Tabla compartida `records` con índices y JSONB (`jsonb(?)` / `json(content)`)
- [x] `ModuleRepository` con los 6 métodos requeridos
- [x] Módulo `productos` completo (CRUD + validaciones + demo + rutas)
- [x] Frontend responsivo con catálogo, buscador y categorías
- [ ] **Probar contra la base de datos real de Turso** — requiere que el líder
      cree la base en Turso y llene `.env` con `TURSO_DATABASE_URL` y
      `TURSO_AUTH_TOKEN` reales. Hasta entonces, la conectividad con Turso
      **no ha sido verificada** con credenciales reales.
- [ ] Módulos `categorias`, `inventario` y `proveedores` (Alexis, Kevin y José Luis)

## 👥 Equipo

- **Adolfo** — Líder · módulo `productos`
- **Alexis** — módulo `categorias`
- **Kevin** — módulo `inventario`
- **José Luis** — módulo `proveedores`
