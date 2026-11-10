/**
 * Conexión compartida a la base de datos Turso (libSQL).
 *
 * TODOS los módulos del proyecto usan esta MISMA conexión a través de
 * `ModuleRepository`. Nadie más debe crear clientes por su cuenta.
 *
 * Las credenciales se leen del archivo `.env` (ver `.env.example`):
 *   - TURSO_DATABASE_URL  -> libsql://tu-base-de-datos.turso.io (o file:local.db para pruebas locales)
 *   - TURSO_AUTH_TOKEN    -> token de acceso generado con `turso db tokens create`
 */
import "dotenv/config";
import { createClient, type Client } from "@libsql/client";

/** Cliente único (patrón singleton) reutilizado por toda la aplicación. */
let client: Client | null = null;

/**
 * Devuelve la conexión compartida a Turso.
 * La crea la primera vez que se invoca y reutiliza la misma instancia después.
 *
 * @throws Error si TURSO_DATABASE_URL no está definida en el archivo .env
 */
export function getDb(): Client {
  if (client) {
    return client;
  }

  const url = process.env.TURSO_DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL no está definida. Copia .env.example a .env y coloca la URL de tu base de datos Turso.",
    );
  }

  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  // En bases de datos remotas de Turso (libsql://...) se requiere el token.
  // En archivos locales de pruebas (file:local.db) el token no es necesario.
  client = authToken ? createClient({ url, authToken }) : createClient({ url });

  return client;
}
