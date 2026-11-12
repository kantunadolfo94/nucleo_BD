/**
 * Tipos del módulo `botas`.
 */

export type ProductoBota = {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  talla: number;
  existencia: number;
};

export type ProductoBotaInput = ProductoBota;
export type ProductoBotaUpdate = Partial<ProductoBota>;
