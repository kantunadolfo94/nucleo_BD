/**
 * Servicio del módulo `deportivos` — MÓDULO DE REFERENCIA.
 *
 * Este módulo está completo a propósito: sirve de ejemplo para que
 * Alexis (casuales), Kevin (botas) y José Luis (vestir)
 * repliquen el mismo patrón en sus módulos.
 *
 * Reglas del patrón:
 *  1. Usa `ModuleRepository` (NO escribe SQL directo para CRUD).
 *  2. Valida los datos ANTES de guardarlos.
 *  3. Toma el autor desde una variable de entorno AUTOR_<MODULO>.
 */
import { ModuleRepository, type ShopRecord } from "../../core/ModuleRepository";
import {
  CATEGORIAS,
  type Categoria,
  type Producto,
  type ProductoInput,
  type ProductoUpdate,
} from "./types";

/** Nombre del módulo: también es el valor de la columna `modulo` en `records`. */
const MODULO = "deportivos";

/** Error de validación: la capa de rutas lo traduce a HTTP 400. */
export class DeportivoValidationError extends Error {
  readonly errores: string[];

  constructor(errores: string[]) {
    super(errores.join(" "));
    this.name = "DeportivoValidationError";
    this.errores = errores;
  }
}

/**
 * Valida un producto.
 * @param parcial Si es `true` solo valida los campos presentes (para updates).
 */
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
    if (
      typeof datos.existencia !== "number" ||
      !Number.isInteger(datos.existencia) ||
      datos.existencia < 0
    ) {
      errores.push("El campo 'existencia' debe ser un número entero mayor o igual a 0.");
    }
  }

  return errores;
}

export class DeportivoService {
  private readonly repo: ModuleRepository<Producto>;

  /**
   * @param autor Quién crea los registros. Por defecto toma AUTOR_DEPORTIVOS del .env.
   */
  constructor(autor: string = process.env.AUTOR_DEPORTIVOS?.trim() || "Adolfo") {
    this.repo = new ModuleRepository<Producto>(MODULO, autor);
  }

  /** Autor que se inyecta en los registros de productos. */
  get autor(): string {
    return this.repo.nombreAutor;
  }

  /** Registra un producto nuevo (valida antes de guardar). */
  async registrar(datos: ProductoInput): Promise<ShopRecord<Producto>> {
    const errores = validarProducto(datos);
    if (errores.length > 0) {
      throw new DeportivoValidationError(errores);
    }
    return this.repo.create(datos);
  }

  /** Consulta todos los productos del catálogo. */
  async obtenerTodos(): Promise<ShopRecord<Producto>[]> {
    return this.repo.findAll();
  }

  /** Busca un producto por su id. Devuelve null si no existe. */
  async obtenerPorId(id: string): Promise<ShopRecord<Producto> | null> {
    return this.repo.findById(id);
  }

  /**
   * Filtra productos por una propiedad JSON (igualdad exacta).
   * Ejemplos: filtrarPor("categoria", "Deportivos"), filtrarPor("talla", 27).
   */
  async filtrarPor(
    campo: string,
    valor: string | number | boolean,
  ): Promise<ShopRecord<Producto>[]> {
    return this.repo.findByField(campo, valor);
  }

  /** Actualiza un producto existente (mezcla con los campos enviados). */
  async actualizar(id: string, cambios: ProductoUpdate): Promise<ShopRecord<Producto> | null> {
    if (!cambios || Object.keys(cambios).length === 0) {
      throw new DeportivoValidationError(["El cuerpo de la petición está vacío: envía al menos un campo."]);
    }
    const errores = validarProducto(cambios, true);
    if (errores.length > 0) {
      throw new DeportivoValidationError(errores);
    }
    return this.repo.update(id, cambios);
  }

  /** Elimina un producto. Devuelve true si se eliminó. */
  async eliminar(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
