/**
 * DEMOSTRACIÓN del módulo `vestir` — comando: `npm run demo:vestir`.
 */
import "dotenv/config";
import { ensureSchema } from "../../db/init";
import { VestirService } from "./service";
import type { ProductoVestirInput } from "./types";

function paso(titulo: string): void { console.log(`\n═════════════════ ${titulo} ═════════════════`); }
function imprimir(etiqueta: string, registro: unknown): void { console.log(`${etiqueta}:`); console.log(JSON.stringify(registro, null, 2)); }

async function main(): Promise<void> {
  if (!process.env.TURSO_DATABASE_URL?.trim()) { console.error("❌ Falta TURSO_DATABASE_URL"); process.exit(1); }
  const service = new VestirService();
  console.log(`👟 SneakShop — demo del módulo 'vestir' (autor: ${service.autor})`);
  paso("0. Preparar base de datos"); await ensureSchema(); console.log("Tabla 'records' lista.");
  paso("1. Registrar (CREATE)");
  const r1 = await service.registrar({ nombre: "Elegance Classic", descripcion: "Zapato de vestir de piel, suela de cuero.", categoria: "De vestir", precio: 2599, talla: 28, existencia: 4 });
  const r2 = await service.registrar({ nombre: "Noir Oxford", descripcion: "Oxford clásico para eventos formales.", categoria: "De vestir", precio: 2899, talla: 27, existencia: 3 });
  imprimir("Producto 1", r1); imprimir("Producto 2", r2);
  paso("2. Consultar todas (findAll)"); const todos = await service.obtenerTodos(); console.log(`Total: ${todos.length}`);
  paso("3. Buscar por ID (findById)"); imprimir("Encontrado", await service.obtenerPorId(r1.id));
  paso("4. Filtrar por propiedad JSON (findByField)"); const f = await service.filtrarPor("categoria", "De vestir"); console.log(`Encontrados: ${f.length}`);
  paso("5. Actualizar (update)"); imprimir("Actualizado", await service.actualizar(r1.id, { precio: 2399 }));
  paso("6. Eliminar (delete)"); console.log(await service.eliminar(r2.id) ? "Eliminado correctamente." : "No encontrado.");
  paso("7. Catálogo final"); const finales = await service.obtenerTodos(); console.log(`Total final: ${finales.length}`);
  console.log("\n✅ Demo completada.");
}

main().catch((error) => { console.error("\n❌ La demo falló:", error instanceof Error ? error.message : error); process.exit(1); });
