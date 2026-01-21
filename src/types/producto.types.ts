export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_venta: number;
  stock: number;
  imagen_url?: string;
  codigo_barra?: string;
  marca?: {
    id: string;
    nombre: string;
  };
  categoria?: {
    id: string;
    nombre: string;
  };
  estado: string;
}

export interface ProductoCarrito {
  id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto: Producto;
}
