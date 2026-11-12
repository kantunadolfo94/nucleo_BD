/**
 * Servidor de SneakShop — Express + TypeScript.
 *
 * - Sirve el frontend estático desde /public
 * - Monta la API del módulo deportivos en /api/deportivos
 * - Verifica la base de datos al arrancar (sin bloquear el arranque)
 */
import "dotenv/config";
import path from "node:path";
import express, { type NextFunction, type Request, type Response } from "express";
import { ensureSchema } from "./db/init";
import { deportivosRouter } from "./modules/deportivos/routes";
import { casualesRouter } from "./modules/casuales/routes";
import { vestirRouter } from "./modules/vestir/routes";
import { botasRouter } from "./modules/botas/routes";

const app = express();
const PUERTO = Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 3000;

// Middleware para leer JSON en las peticiones (req.body)
app.use(express.json());

// ---------------------------------------------------------------------------
// Frontend estático (HTML, CSS, JS e imágenes en /public)
// ---------------------------------------------------------------------------
const carpetaPublic = path.join(__dirname, "..", "public");
app.use(express.static(carpetaPublic));

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, servicio: "SneakShop API", hora: new Date().toISOString() });
});

// Módulos (Adolfo, Alexis, José Luis, Kevin)
app.use("/api/deportivos", deportivosRouter);
app.use("/api/casuales", casualesRouter);
app.use("/api/vestir", vestirRouter);
app.use("/api/botas", botasRouter);

// 404 para rutas de API que no existan
app.use("/api", (_req, res) => {
  res.status(404).json({ ok: false, mensaje: "Ruta de API no encontrada" });
});

// ---------------------------------------------------------------------------
// Manejador global de errores (ej. JSON mal formado en req.body)
// ---------------------------------------------------------------------------
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof SyntaxError && "body" in (error as object)) {
    res.status(400).json({ ok: false, mensaje: "JSON inválido en el cuerpo de la petición" });
    return;
  }
  console.error("[server] Error no controlado:", error);
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
});

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  // Verifica la conexión y la tabla 'records' al arrancar.
  // Si falla, el servidor arranca igual (el frontend se sirve), pero la
  // API responderá con error hasta que se configure .env correctamente.
  try {
    await ensureSchema();
    console.log("✅ Base de datos lista (tabla 'records' verificada).");
  } catch (error) {
    console.warn("⚠️  No se pudo verificar la base de datos al arrancar:");
    console.warn(`   ${error instanceof Error ? error.message : String(error)}`);
    console.warn("   La página se servirá, pero la API /api/deportivos fallará hasta que:");
    console.warn("     1. Configures TURSO_DATABASE_URL y TURSO_AUTH_TOKEN en .env");
    console.warn("     2. Ejecutes 'npm run db:init'");
  }

  app.listen(PUERTO, () => {
    console.log(`👟 SneakShop corriendo en http://localhost:${PUERTO}`);
  });
}

void main();
