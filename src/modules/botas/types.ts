/**
 * Tipos del módulo `botas`.
 * PLANTILLA: misma estructura que `deportivos` (módulo de referencia).
 */

export const CATEGORIAS = ["Deportivos", "Casuales", "De vestir", "Botas"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export type Producto = {
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  talla: number;
  existencia: number;
};

export type ProductoInput = Producto;
export type ProductoUpdate = Partial<Producto>;
