// ==================== TIPOS PARA CATÁLOGO ====================

export interface Categoria {
  id_categoria_producto?: number;
  id_categoria?: number; // Alias
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface Marca {
  id_marca: number;
  nombre: string;
  id_categoria?: number;
  id_categoria_producto?: number;
  estado?: string;
  logo_url?: string | null;
  cantidad_productos?: number;
  activo?: boolean;
  categoria?: Categoria;
  categoria_producto?: Categoria;
}

export interface Producto {
  id_producto: string;
  nombre?: string; // Alias para descripcion
  descripcion?: string;
  precio_venta: number;
  precio_regular?: number;
  volumen?: number;
  volumen_ml?: number; // Alias
  alcohol_vol?: number;
  porcentaje_alcohol?: number; // Alias
  origen?: string;
  notas_cata?: string;
  saldo_actual?: number;
  stock?: number; // Alias para saldo_actual
  estado?: string;
  activo?: boolean;
  id_categoria_producto?: number;
  id_marca?: number;
  // Relaciones expandidas
  categoria_producto?: Categoria;
  categoria?: Categoria; // Alias
  marca?: Marca;
  // Campos calculados
  descuento_porcentaje?: number;
  imagen_url?: string | null;
}

export interface FiltrosProducto {
  categoriaId?: number;
  marcaId?: number;
  precioMin?: number;
  precioMax?: number;
  volumen?: string;
  alcoholMin?: number;
  alcoholMax?: number;
  origen?: string;
  enStock?: boolean;
  busqueda?: string;
  ordenarPor?: 'precio_asc' | 'precio_desc' | 'nombre_asc' | 'nombre_desc' | 'popular';
  pagina?: number;
  limite?: number;
}

export interface ProductosResponse {
  productos: Producto[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface FiltrosDinamicos {
  origenes: string[];
  volumenes: number[];
  alcoholRango: { min: number; max: number };
  precioRango: { min: number; max: number };
}

// Para el carrito local
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  precio_venta?: number; // Para compatibilidad
}

// Para favoritos (API)
export interface Favorito {
  id_favorito: number;
  id_usuario: number;
  id_producto: string;
  fecha_creacion: string;
  estado: string;
  producto?: Producto;
}

// Para favoritos locales (legacy)
export interface FavoritoLocal {
  id_producto: string;
  fecha_agregado: Date;
}
