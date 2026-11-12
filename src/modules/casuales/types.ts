/**
 * Tipos del módulo `casuales`.
 *
 * Cada categoría se guarda como JSON dentro de la columna `content`
 * de la tabla compartida `records`. Estos tipos describen ese JSON.
 */

/** Contenido JSON que guarda cada categoría casual. */
export type CategoriaCasual = {
  nombre: string;
  descripcion: string;
  imagen: string;
};

/** Datos necesarios para registrar una categoría (todos los campos). */
export type CategoriaCasualInput = CategoriaCasual;

/** Datos aceptados para actualizar (campos opcionales). */
export type CategoriaCasualUpdate = Partial<CategoriaCasual>;
