/**
 * DEMOSTRACIÓN del módulo `deportivos` — comando: `npm run demo:deportivos`.
 *
 * Ejecuta TODAS las operaciones CRUD contra la base de datos y muestra
 * los resultados en consola. Es la prueba de humo del módulo de referencia.
 *
 * Requisitos:
 *   1. Copia .env.example a .env y configura TURSO_DATABASE_URL.
 *   2. (Opcional, para pruebas sin Turso) usa TURSO_DATABASE_URL=file:local.db
 *
 * La demo crea la tabla si falta (ensureSchema), así que no necesitas
 * correr `npm run db:init` antes (aunque es recomendable).
 */
import "dotenv/config";
import { ensureSchema } from "../../db/init";
import { DeportivoService } from "./service";
import type { ProductoInput } from "./types";

/** Separa cada paso de la demo en la consola. */
function paso(titulo: string): void {
  console.log(`\n═════════════════ ${titulo} ═════════════════`);
}

/** Imprime un registro en formato legible. */
function imprimir(etiqueta: string, registro: unknown): void {
  console.log(`${etiqueta}:`);
  console.log(JSON.stringify(registro, null, 2));
}

async function main(): Promise<void> {
  // Verificación honesta: sin credenciales la demo NO puede correr.
  if (!process.env.TURSO_DATABASE_URL?.trim()) {
    console.error("❌ Falta TURSO_DATABASE_URL en tu archivo .env");
    console.error("   1. Copia .env.example a .env");
    console.error("   2. Coloca la URL de tu base de datos Turso (libsql://...)");
    console.error("   3. O usa una base local para pruebas: TURSO_DATABASE_URL=file:local.db");
    process.exit(1);
  }

  const service = new DeportivoService();
  console.log(`👟 SneakShop — demo del módulo 'deportivos' (autor: ${service.autor})`);

  // 0. Garantizar que la tabla exista.
  paso("0. Preparar base de datos");
  await ensureSchema();
  console.log("Tabla 'records' lista.");

  // 1. Registrar productos.
  paso("1. Registrar productos (CREATE)");
  const deportivo: ProductoInput = {
    nombre: "Neon Runner X1",
    descripcion: "Tenis de running con malla respirable y suela reactiva.",
    categoria: "Deportivos",
    precio: 2199,
    talla: 27,
    existencia: 10,
  };
  const casual: ProductoInput = {
    nombre: "Midnight Court",
    descripcion: "Sneaker casual de piel con suela de goma, edición nocturna.",
    categoria: "Casuales",
    precio: 1749.5,
    talla: 26,
    existencia: 3,
  };

  const registro1 = await service.registrar(deportivo);
  const registro2 = await service.registrar(casual);
  imprimir("Producto 1", registro1);
  imprimir("Producto 2", registro2);

  // 2. Consultar todos.
  paso("2. Consultar productos (findAll)");
  const todos = await service.obtenerTodos();
  console.log(`Total de productos en el catálogo: ${todos.length}`);
  todos.forEach((p, i) =>
    console.log(`  ${i + 1}. ${p.content.nombre} — $${p.content.precio} (${p.content.categoria})`),
  );

  // 3. Buscar por id.
  paso("3. Buscar por ID (findById)");
  const encontrado = await service.obtenerPorId(registro1.id);
  imprimir(`Producto ${registro1.id}`, encontrado);

  // 4. Filtrar por una propiedad JSON.
  paso("4. Filtrar por propiedad JSON (findByField)");
  const soloDeportivos = await service.filtrarPor("categoria", "Deportivos");
  console.log(`Productos con categoria = "Deportivos": ${soloDeportivos.length}`);
  soloDeportivos.forEach((p) => console.log(`  • ${p.content.nombre} — $${p.content.precio}`));

  // 5. Actualizar.
  paso("5. Actualizar producto (update)");
  const actualizado = await service.actualizar(registro1.id, {
    precio: 1999,
    existencia: 8,
  });
  imprimir("Producto actualizado", actualizado);

  // 6. Eliminar.
  paso("6. Eliminar producto (delete)");
  const eliminado = await service.eliminar(registro2.id);
  console.log(eliminado ? `Producto ${registro2.id} eliminado correctamente.` : "No se encontró el producto.");

  // 7. Estado final.
  paso("7. Catálogo final");
  const finales = await service.obtenerTodos();
  console.log(`Total de productos después de la demo: ${finales.length}`);
  finales.forEach((p) =>
    console.log(`  • ${p.content.nombre} — $${p.content.precio} (talla ${p.content.talla}, existencia ${p.content.existencia})`),
  );

  console.log("\n✅ Demo completada: create, findAll, findById, findByField, update y delete funcionaron.");
  console.log("   Nota: los registros que no se eliminaron quedaron guardados en la base de datos.");
}

main().catch((error) => {
  console.error("\n❌ La demo falló:", error instanceof Error ? error.message : error);
  console.error("   Posibles causas:");
  console.error("   - Credenciales incorrectas en .env (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN)");
  console.error("   - Sin conexión a internet o la base de datos de Turso no existe");
  console.error("   - No se ejecutó 'npm run db:init'");
  process.exit(1);
});
