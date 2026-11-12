/**
 * Servicio del módulo `botas`.
 * PLANTILLA: misma estructura que `deportivos` (módulo de referencia).
 */
import { ModuleRepository, type ShopRecord } from "../../core/ModuleRepository";
import {
  CATEGORIAS,
  type Categoria,
  type Producto,
  type ProductoInput,
  type ProductoUpdate,
} from "./types";

const MODULO = "botas";

export class BotaValidationError extends Error {
  readonly errores: string[];

  constructor(errores: string[]) {
    super(errores.join(" "));
    this.name = "BotaValidationError";
    this.errores = errores;
  }
}

export function validarProducto(datos: Partial<Producto>, parcial = false): string[] {
  const errores: string[] = [];

  if (!parcial || datos.nombre !== undefined) {
    if (typeof datos.nombre !== "string" || datos.nombre.trim().length < 3) {
      errores.push("El campo 'nombre' es obligatorio y debe tener al menos 3 caracteres.");
    }
  }
  if (!parcial || datos.descripcion !== undefined) {
    if (typeof datos.descripcion !== "string" || datos.descripcion.trim().length < 5) {
      errores.push("El campo 'descripcion' es obligatorio y debe tener al menos 5 caracteres.");
    }
  }
  if (!parcial || datos.categoria !== undefined) {
    if (!CATEGORIAS.includes(datos.categoria as Categoria)) {
      errores.push(`El campo 'categoria' debe ser uno de: ${CATEGORIAS.join(", ")}.`);
    }
  }
  if (!parcial || datos.precio !== undefined) {
    if (typeof datos.precio !== "number" || !Number.isFinite(datos.precio) || datos.precio <= 0) {
      errores.push("El campo 'precio' debe ser un número mayor a 0.");
    }
  }
  if (!parcial || datos.talla !== undefined) {
    if (typeof datos.talla !== "number" || datos.talla < 18 || datos.talla > 45) {
      errores.push("El campo 'talla' debe ser un número entre 18 y 45 (MX).");
    }
  }
  if (!parcial || datos.existencia !== undefined) {
    if (typeof datos.existencia !== "number" || !Number.isInteger(datos.existencia) || datos.existencia < 0) {
      errores.push("El campo 'existencia' debe ser un número entero mayor o igual a 0.");
    }
  }

  return errores;
}

export class BotaService {
  private readonly repo: ModuleRepository<Producto>;

  constructor(autor: string = process.env.AUTOR_BOTAS?.trim() || "Kevin") {
    this.repo = new ModuleRepository<Producto>(MODULO, autor);
  }

  get autor(): string {
    return this.repo.nombreAutor;
  }

  async registrar(datos: ProductoInput): Promise<ShopRecord<Producto>> {
    const errores = validarProducto(datos);
    if (errores.length > 0) {
      throw new BotaValidationError(errores);
    }
    return this.repo.create(datos);
  }

  async obtenerTodos(): Promise<ShopRecord<Producto>[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<ShopRecord<Producto> | null> {
    return this.repo.findById(id);
  }

  async filtrarPor(campo: string, valor: string | number | boolean): Promise<ShopRecord<Producto>[]> {
    return this.repo.findByField(campo, valor);
  }

  async actualizar(id: string, cambios: ProductoUpdate): Promise<ShopRecord<Producto> | null> {
    if (!cambios || Object.keys(cambios).length === 0) {
      throw new BotaValidationError(["El cuerpo de la petición está vacío: envía al menos un campo."]);
    }
    const errores = validarProducto(cambios, true);
    if (errores.length > 0) {
      throw new BotaValidationError(errores);
    }
    return this.repo.update(id, cambios);
  }

  async eliminar(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
