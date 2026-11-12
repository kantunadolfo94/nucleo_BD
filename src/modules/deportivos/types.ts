/**
 * Tipos del módulo `productos`.
 *
 * Cada producto se guarda como JSON dentro de la columna `content`
 * de la tabla compartida `records`. Estos tipos describen ese JSON.
 */

/** Categorías válidas para los productos de SneakShop. */
export const CATEGORIAS = ["Deportivos", "Casuales", "De vestir", "Botas"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

/** Contenido JSON que guarda cada producto. */
// Nota: se usa `type` en lugar de `interface` para que el objeto sea
// asignable a `RecordContent` (Record<string, unknown>) de ModuleRepository.
export type Producto = {
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  talla: number;
  existencia: number;
};

/** Datos necesarios para registrar un producto (todos los campos). */
export type ProductoInput = Producto;

/** Datos aceptados para actualizar un producto (campos opcionales). */
export type ProductoUpdate = Partial<Producto>;
