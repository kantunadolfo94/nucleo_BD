/**
 * Servicio del módulo `vestir`.
 * Sigue el mismo patrón que `deportivos` (módulo de referencia).
 */
import { ModuleRepository, type ShopRecord } from "../../core/ModuleRepository";
import {
  type ProductoVestir,
  type ProductoVestirInput,
  type ProductoVestirUpdate,
} from "./types";

const MODULO = "vestir";

export class VestirValidationError extends Error {
  readonly errores: string[];

  constructor(errores: string[]) {
    super(errores.join(" "));
    this.name = "VestirValidationError";
    this.errores = errores;
  }
}

export function validarVestir(datos: Partial<ProductoVestir>, parcial = false): string[] {
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
  if (!parcial || datos.precio !== undefined) {
    if (typeof datos.precio !== "number" || !Number.isFinite(datos.precio) || datos.precio <= 0) {
      errores.push("El campo 'precio' debe ser un número mayor a 0.");
    }
  }
  if (!parcial || datos.talla !== undefined) {
    if (typeof datos.talla !== "number" || datos.talla < 18 || datos.talla > 45) {
      errores.push("El campo 'talla' debe ser un número entre 18 y 45.");
    }
  }
  if (!parcial || datos.existencia !== undefined) {
    if (typeof datos.existencia !== "number" || !Number.isInteger(datos.existencia) || datos.existencia < 0) {
      errores.push("El campo 'existencia' debe ser un número entero mayor o igual a 0.");
    }
  }

  return errores;
}

export class VestirService {
  private readonly repo: ModuleRepository<ProductoVestir>;

  constructor(autor: string = process.env.AUTOR_VESTIR?.trim() || "Jose Luis") {
    this.repo = new ModuleRepository<ProductoVestir>(MODULO, autor);
  }

  get autor(): string {
    return this.repo.nombreAutor;
  }

  async registrar(datos: ProductoVestirInput): Promise<ShopRecord<ProductoVestir>> {
    const errores = validarVestir(datos);
    if (errores.length > 0) {
      throw new VestirValidationError(errores);
    }
    return this.repo.create(datos);
  }

  async obtenerTodos(): Promise<ShopRecord<ProductoVestir>[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<ShopRecord<ProductoVestir> | null> {
    return this.repo.findById(id);
  }

  async filtrarPor(campo: string, valor: string | number | boolean): Promise<ShopRecord<ProductoVestir>[]> {
    return this.repo.findByField(campo, valor);
  }

  async actualizar(id: string, cambios: ProductoVestirUpdate): Promise<ShopRecord<ProductoVestir> | null> {
    if (!cambios || Object.keys(cambios).length === 0) {
      throw new VestirValidationError(["El cuerpo de la petición está vacío: envía al menos un campo."]);
    }
    const errores = validarVestir(cambios, true);
    if (errores.length > 0) {
      throw new VestirValidationError(errores);
    }
    return this.repo.update(id, cambios);
  }

  async eliminar(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
