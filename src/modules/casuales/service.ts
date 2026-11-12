/**
 * Servicio del módulo `casuales`.
 *
 * Sigue el mismo patrón que `deportivos` (módulo de referencia).
 * CRUD completo usando ModuleRepository.
 */
import { ModuleRepository, type ShopRecord } from "../../core/ModuleRepository";
import {
  type CategoriaCasual,
  type CategoriaCasualInput,
  type CategoriaCasualUpdate,
} from "./types";

const MODULO = "casuales";

export class CasualValidationError extends Error {
  readonly errores: string[];

  constructor(errores: string[]) {
    super(errores.join(" "));
    this.name = "CasualValidationError";
    this.errores = errores;
  }
}

export function validarCasual(datos: Partial<CategoriaCasual>, parcial = false): string[] {
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
  if (!parcial || datos.imagen !== undefined) {
    if (typeof datos.imagen !== "string" || datos.imagen.trim().length === 0) {
      errores.push("El campo 'imagen' es obligatorio.");
    }
  }

  return errores;
}

export class CasualService {
  private readonly repo: ModuleRepository<CategoriaCasual>;

  constructor(autor: string = process.env.AUTOR_CASUALES?.trim() || "Alexis") {
    this.repo = new ModuleRepository<CategoriaCasual>(MODULO, autor);
  }

  get autor(): string {
    return this.repo.nombreAutor;
  }

  async registrar(datos: CategoriaCasualInput): Promise<ShopRecord<CategoriaCasual>> {
    const errores = validarCasual(datos);
    if (errores.length > 0) {
      throw new CasualValidationError(errores);
    }
    return this.repo.create(datos);
  }

  async obtenerTodos(): Promise<ShopRecord<CategoriaCasual>[]> {
    return this.repo.findAll();
  }

  async obtenerPorId(id: string): Promise<ShopRecord<CategoriaCasual> | null> {
    return this.repo.findById(id);
  }

  async filtrarPor(campo: string, valor: string | number | boolean): Promise<ShopRecord<CategoriaCasual>[]> {
    return this.repo.findByField(campo, valor);
  }

  async actualizar(id: string, cambios: CategoriaCasualUpdate): Promise<ShopRecord<CategoriaCasual> | null> {
    if (!cambios || Object.keys(cambios).length === 0) {
      throw new CasualValidationError(["El cuerpo de la petición está vacío: envía al menos un campo."]);
    }
    const errores = validarCasual(cambios, true);
    if (errores.length > 0) {
      throw new CasualValidationError(errores);
    }
    return this.repo.update(id, cambios);
  }

  async eliminar(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
