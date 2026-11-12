/**
 * Repositorio genérico y reutilizable para TODOS los módulos de SneakShop.
 *
 * Todos los módulos comparten una sola tabla llamada `records`:
 *
 *   id         TEXT PRIMARY KEY
 *   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
 *   autor      TEXT NOT NULL
 *   modulo     TEXT NOT NULL
 *   content    BLOB NOT NULL    <- JSON del registro guardado con jsonb()
 *
 * El repositorio inyecta automáticamente `modulo` y `autor` en cada
 * operación, de modo que cada integrante solo se preocupa por el
 * contenido JSON de su propio módulo.
 *
 * JSONB: al guardar se usa la función `jsonb(?)` y al consultar
 * `json(content)`, que convierte el BLOB de vuelta a texto JSON.
 */
import { randomUUID } from "node:crypto";
import type { Row } from "@libsql/client";
import { getDb } from "../config/database";

/** Forma mínima que debe cumplir el contenido JSON de cualquier módulo. */
export type RecordContent = Record<string, unknown>;

/** Registro tal como vive en la tabla `records`. */
export interface ShopRecord<T extends RecordContent = RecordContent> {
  id: string;
  created_at: string;
  autor: string;
  modulo: string;
  content: T;
}

/**
 * Columnas base para consultas: `json(content)` convierte el BLOB jsonb
 * de vuelta a texto JSON legible.
 */
const SELECT_COLUMNAS = "id, created_at, autor, modulo, json(content) AS content";

export class ModuleRepository<T extends RecordContent = RecordContent> {
  private readonly modulo: string;
  private readonly autor: string;

  /**
   * @param modulo Nombre del módulo (ej. "deportivos", "casuales", "vestir", "botas").
   * @param autor  Nombre del integrante dueño del registro (ej. "Adolfo").
   */
  constructor(modulo: string, autor: string) {
    if (!modulo?.trim()) {
      throw new Error("ModuleRepository: el nombre del módulo es obligatorio.");
    }
    if (!autor?.trim()) {
      throw new Error("ModuleRepository: el autor es obligatorio (revista la variable AUTOR_* en .env).");
    }
    this.modulo = modulo.trim();
    this.autor = autor.trim();
  }

  /** Nombre del módulo que administra este repositorio. */
  get nombreModulo(): string {
    return this.modulo;
  }

  /** Autor que se inyecta en los registros nuevos. */
  get nombreAutor(): string {
    return this.autor;
  }

  /**
   * Crea un registro nuevo. El `id` se genera automáticamente y
   * `autor` / `modulo` se inyectan solos.
   */
  async create(data: T): Promise<ShopRecord<T>> {
    const id = randomUUID();
    const db = getDb();

    await db.execute({
      sql: "INSERT INTO records (id, autor, modulo, content) VALUES (?, ?, ?, jsonb(?))",
      args: [id, this.autor, this.modulo, JSON.stringify(data)],
    });

    const creado = await this.findById(id);
    if (!creado) {
      throw new Error(`No se pudo leer el registro recién creado (id: ${id}).`);
    }
    return creado;
  }

  /** Devuelve todos los registros del módulo, del más reciente al más antiguo. */
  async findAll(): Promise<ShopRecord<T>[]> {
    const resultado = await getDb().execute({
      sql: `SELECT ${SELECT_COLUMNAS} FROM records WHERE modulo = ? ORDER BY created_at DESC`,
      args: [this.modulo],
    });
    return resultado.rows.map((row) => this.mapearFila(row));
  }

  /** Busca un registro por su id (únicamente dentro del módulo). */
  async findById(id: string): Promise<ShopRecord<T> | null> {
    const resultado = await getDb().execute({
      sql: `SELECT ${SELECT_COLUMNAS} FROM records WHERE id = ? AND modulo = ? LIMIT 1`,
      args: [id, this.modulo],
    });
    return resultado.rows[0] ? this.mapearFila(resultado.rows[0]) : null;
  }

  /**
   * Filtra registros por una propiedad guardada dentro del JSON.
   * Ejemplo: findByField("categoria", "Deportivos")
   *
   * Nota: la comparación es exacta (igualdad). Los valores booleanos
   * se comparan como 1 / 0.
   */
  async findByField(jsonKey: string, value: string | number | boolean): Promise<ShopRecord<T>[]> {
    if (!jsonKey?.trim()) {
      throw new Error("findByField: el nombre de la propiedad JSON es obligatorio.");
    }

    const resultado = await getDb().execute({
      sql: `SELECT ${SELECT_COLUMNAS} FROM records
            WHERE modulo = ? AND json_extract(json(content), ?) = ?`,
      args: [this.modulo, `$.${jsonKey.trim()}`, value],
    });
    return resultado.rows.map((row) => this.mapearFila(row));
  }

  /**
   * Actualiza el contenido JSON de un registro.
   * Los campos nuevos se mezclan con los que ya existía el registro.
   * Devuelve el registro actualizado o `null` si no se encontró.
   */
  async update(id: string, data: Partial<T>): Promise<ShopRecord<T> | null> {
    const existente = await this.findById(id);
    if (!existente) {
      return null;
    }

    const combinado = { ...existente.content, ...data };
    await getDb().execute({
      sql: "UPDATE records SET content = jsonb(?) WHERE id = ? AND modulo = ?",
      args: [JSON.stringify(combinado), id, this.modulo],
    });

    return this.findById(id);
  }

  /** Elimina un registro. Devuelve `true` si realmente se eliminó algo. */
  async delete(id: string): Promise<boolean> {
    const resultado = await getDb().execute({
      sql: "DELETE FROM records WHERE id = ? AND modulo = ?",
      args: [id, this.modulo],
    });
    return resultado.rowsAffected > 0;
  }

  /** Convierte una fila cruda de la base de datos en un objeto tipado. */
  private mapearFila(row: Row): ShopRecord<T> {
    return {
      id: String(row.id),
      created_at: String(row.created_at),
      autor: String(row.autor),
      modulo: String(row.modulo),
      content: JSON.parse(String(row.content)) as T,
    };
  }
}
