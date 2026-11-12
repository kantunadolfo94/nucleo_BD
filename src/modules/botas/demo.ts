/**
 * DEMOSTRACIÓN del módulo `botas` — comando: `npm run demo:botas`.
 */
import "dotenv/config";
import { ensureSchema } from "../../db/init";
import { BotaService } from "./service";
import type { ProductoBotaInput } from "./types";

function paso(titulo: string): void { console.log(`\n═════════════════ ${titulo} ═════════════════`); }
function imprimir(etiqueta: string, registro: unknown): void { console.log(`${etiqueta}:`); console.log(JSON.stringify(registro, null, 2)); }

async function main(): Promise<void> {
  if (!process.env.TURSO_DATABASE_URL?.trim()) { console.error("❌ Falta TURSO_DATABASE_URL"); process.exit(1); }
  const service = new BotaService();
  console.log(`👟 SneakShop — demo del módulo 'botas' (autor: ${service.autor})`);
  paso("0. Preparar base de datos"); await ensureSchema(); console.log("Tabla 'records' lista.");
  paso("1. Registrar (CREATE)");
  const r1 = await service.registrar({ nombre: "Shadow Boot 3000", descripcion: "Bota resistente con suela antideslizante.", categoria: "Botas", precio: 2399, talla: 28, existencia: 6 });
  const r2 = await service.registrar({ nombre: "TrailMaster Boot", descripcion: "Bota de senderismo impermeable.", categoria: "Botas", precio: 2799, talla: 29, existencia: 4 });
  imprimir("Bota 1", r1); imprimir("Bota 2", r2);
  paso("2. Consultar todas (findAll)"); const todos = await service.obtenerTodos(); console.log(`Total: ${todos.length}`);
  paso("3. Buscar por ID (findById)"); imprimir("Encontrado", await service.obtenerPorId(r1.id));
  paso("4. Filtrar por propiedad JSON (findByField)"); const f = await service.filtrarPor("categoria", "Botas"); console.log(`Encontrados: ${f.length}`);
  paso("5. Actualizar (update)"); imprimir("Actualizado", await service.actualizar(r1.id, { precio: 2199 }));
  paso("6. Eliminar (delete)"); console.log(await service.eliminar(r2.id) ? "Eliminado correctamente." : "No encontrado.");
  paso("7. Catálogo final"); const finales = await service.obtenerTodos(); console.log(`Total final: ${finales.length}`);
  console.log("\n✅ Demo completada.");
}

main().catch((error) => { console.error("\n❌ La demo falló:", error instanceof Error ? error.message : error); process.exit(1); });
