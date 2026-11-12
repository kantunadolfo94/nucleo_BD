/**
 * DEMOSTRACIÓN del módulo `casuales` — comando: `npm run demo:casuales`.
 */
import "dotenv/config";
import { ensureSchema } from "../../db/init";
import { CasualService } from "./service";
import type { ProductoInput } from "./types";

function paso(titulo: string): void { console.log(`\n═════════════════ ${titulo} ═════════════════`); }
function imprimir(etiqueta: string, registro: unknown): void { console.log(`${etiqueta}:`); console.log(JSON.stringify(registro, null, 2)); }

async function main(): Promise<void> {
  if (!process.env.TURSO_DATABASE_URL?.trim()) { console.error("❌ Falta TURSO_DATABASE_URL"); process.exit(1); }

  const service = new CasualService();
  console.log(`👟 SneakShop — demo del módulo 'casuales' (autor: ${service.autor})`);

  paso("0. Preparar base de datos"); await ensureSchema(); console.log("Tabla 'records' lista.");

  paso("1. Registrar (CREATE)");
  const p1: ProductoInput = { nombre: "Midnight Court", descripcion: "Sneaker casual de piel, edición nocturna.", categoria: "Casuales", precio: 1749.5, talla: 26, existencia: 6 };
  const p2: ProductoInput = { nombre: "Urban Walk", descripcion: "Zapato casual cómodo para el día a día.", categoria: "Casuales", precio: 1249.9, talla: 27, existencia: 8 };
  const r1 = await service.registrar(p1);
  const r2 = await service.registrar(p2);
  imprimir("Producto 1", r1); imprimir("Producto 2", r2);

  paso("2. Consultar todos (findAll)"); const todos = await service.obtenerTodos(); console.log(`Total: ${todos.length}`); todos.forEach((p) => console.log(`  • ${p.content.nombre}`));

  paso("3. Buscar por ID (findById)"); imprimir("Encontrado", await service.obtenerPorId(r1.id));

  paso("4. Filtrar por propiedad JSON (findByField)"); const f = await service.filtrarPor("categoria", "Casuales"); console.log(`Encontrados: ${f.length}`);

  paso("5. Actualizar (update)"); imprimir("Actualizado", await service.actualizar(r1.id, { precio: 1599 }));

  paso("6. Eliminar (delete)"); console.log(await service.eliminar(r2.id) ? "Eliminado correctamente." : "No encontrado.");

  paso("7. Catálogo final"); const finales = await service.obtenerTodos(); console.log(`Total final: ${finales.length}`); finales.forEach((p) => console.log(`  • ${p.content.nombre}`));

  console.log("\n✅ Demo completada.");
}

main().catch((error) => { console.error("\n❌ La demo falló:", error instanceof Error ? error.message : error); process.exit(1); });
