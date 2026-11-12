/**
 * Tipos del módulo `vestir`.
 */

export type ProductoVestir = {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  talla: number;
  existencia: number;
};

export type ProductoVestirInput = ProductoVestir;
export type ProductoVestirUpdate = Partial<ProductoVestir>;
