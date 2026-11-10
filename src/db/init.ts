/**
 * Inicialización de la base de datos — comando: `npm run db:init`.
 *
 * Crea la tabla compartida `records` y sus índices SOLO si aún no existen
 * (es seguro ejecutarlo varias veces). Todos los módulos del equipo
 * trabajan sobre esta misma tabla:
 *
 *   id         TEXT PRIMARY KEY
 *   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
 *   autor      TEXT NOT NULL
 *   modulo     TEXT NOT NULL
 *   content    BLOB NOT NULL
 */
import "dotenv/config";
import { getDb } from "../config/database";

const SQL_TABLA = `
  CREATE TABLE IF NOT EXISTS records (
    id         TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    autor      TEXT NOT NULL,
    modulo     TEXT NOT NULL,
    content    BLOB NOT NULL
  );`;

const SQL_INDICES = [
  "CREATE INDEX IF NOT EXISTS idx_records_modulo ON records (modulo);",
  "CREATE INDEX IF NOT EXISTS idx_records_autor ON records (autor);",
];

/**
 * Garantiza que la tabla `records` y sus índices existan.
 * La llama `db:init`, la demo de productos y el servidor al arrancar.
 */
export async function ensureSchema(): Promise<void> {
  const db = getDb();
  await db.execute(SQL_TABLA);
  for (const sql of SQL_INDICES) {
    await db.execute(sql);
  }
}

/** Ejecución directa del script (npm run db:init). */
async function main(): Promise<void> {
  try {
    console.log("🔗 Conectando a la base de datos...");
    console.log(`   URL: ${process.env.TURSO_DATABASE_URL ?? "(no configurada)"}`);
    await ensureSchema();
    console.log("✅ Tabla 'records' verificada e índices creados: idx_records_modulo, idx_records_autor.");
  } catch (error) {
    console.error("❌ No se pudo inicializar la base de datos:", error instanceof Error ? error.message : error);
    console.error("   Revisa TURSO_DATABASE_URL y TURSO_AUTH_TOKEN en tu archivo .env");
    process.exit(1);
  }
}

// Solo ejecuta main() cuando el script se corre directamente (npm run db:init),
// no cuando init.ts es importado por otro archivo (server.ts, demo.ts, etc.).
if (require.main === module) {
  void main();
}
