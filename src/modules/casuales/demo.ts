/**
 * DEMOSTRACIÓN del módulo `casuales` — comando: `npm run demo:casuales`.
 */
import "dotenv/config";
import { ensureSchema } from "../../db/init";
import { CasualService } from "./service";
import type { CategoriaCasualInput } from "./types";

function paso(titulo: string): void {
  console.log(`\n═════════════════ ${titulo} ═════════════════`);
}

function imprimir(etiqueta: string, registro: unknown): void {
  console.log(`${etiqueta}:`);
  console.log(JSON.stringify(registro, null, 2));
}

async function main(): Promise<void> {
  if (!process.env.TURSO_DATABASE_URL?.trim()) {
    console.error("❌ Falta TURSO_DATABASE_URL en tu archivo .env");
    process.exit(1);
  }

  const service = new CasualService();
  console.log(`👟 SneakShop — demo del módulo 'casuales' (autor: ${service.autor})`);

  paso("0. Preparar base de datos");
  await ensureSchema();
  console.log("Tabla 'records' lista.");

  paso("1. Registrar categorías (CREATE)");
  const casual1: CategoriaCasualInput = {
    nombre: "Casual Classic",
    descripcion: "Zapato casual cómodo para el día a día.",
    imagen: "/images/categoria-casuales.svg",
  };
  const casual2: CategoriaCasualInput = {
    nombre: "Urban Walk",
    descripcion: "Sneaker casual de piel con suela de goma.",
    imagen: "/images/categoria-casuales.svg",
  };

  const registro1 = await service.registrar(casual1);
  const registro2 = await service.registrar(casual2);
  imprimir("Categoría 1", registro1);
  imprimir("Categoría 2", registro2);

  paso("2. Consultar todas (findAll)");
  const todos = await service.obtenerTodos();
  console.log(`Total: ${todos.length}`);
  todos.forEach((c, i) => console.log(`  ${i + 1}. ${c.content.nombre}`));

  paso("3. Buscar por ID (findById)");
  imprimir(`Categoría ${registro1.id}`, await service.obtenerPorId(registro1.id));

  paso("4. Filtrar por propiedad JSON (findByField)");
  const filtrados = await service.filtrarPor("nombre", "Casual Classic");
  console.log(`Encontrados: ${filtrados.length}`);

  paso("5. Actualizar (update)");
  imprimir("Actualizado", await service.actualizar(registro1.id, { descripcion: "Descripción actualizada." }));

  paso("6. Eliminar (delete)");
  console.log(await service.eliminar(registro2.id) ? "Eliminado correctamente." : "No encontrado.");

  paso("7. Catálogo final");
  const finales = await service.obtenerTodos();
  console.log(`Total final: ${finales.length}`);
  finales.forEach((c) => console.log(`  • ${c.content.nombre}`));

  console.log("\n✅ Demo completada: create, findAll, findById, findByField, update y delete funcionaron.");
}

main().catch((error) => {
  console.error("\n❌ La demo falló:", error instanceof Error ? error.message : error);
  process.exit(1);
});
