// =============================================
// 🛒 SERVICIO DE CARRITO
// =============================================
import { api } from './api';
import { getErrorInfo } from '../utils/errorHandler';

export interface CarritoDetalle {
  id_carrito: string;
  id_producto: string;
  cantidad: number;
  precio_referencial: number;
  subtotal: number;
  fecha_agregado: string;
  producto: {
    id_producto: string;
    descripcion: string;
    precio_venta: number;
    imagen_url: string | null;
    saldo_actual: number;
    estado: string;
    marca?: {
      id_marca: number;
      nombre: string;
    };
  };
  disponible?: boolean;
  stock_disponible?: number;
}

export interface Carrito {
  id_carrito: string;
  id_usuario: number;
  id_canal: string;
  estado: string;
  subtotal: number;
  descuento: number;
  total: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  carrito_detalle: CarritoDetalle[];
  usuario?: {
    id_usuario: number;
    email: string;
  };
  canal_venta?: {
    id_canal: string;
    descripcion: string;
  };
  cantidad_items?: number;
  total_productos?: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export const carritoService = {
  /**
   * Obtener carrito del usuario
   */
  async obtenerCarrito(usuarioId: number): Promise<Carrito | null> {
    console.log('🛒 API: Llamando GET /carrito?clienteId=' + usuarioId);
    try {
      const response = await api.get<ApiResponse<Carrito | null>>(
        `/carrito?clienteId=${usuarioId}`
      );
      console.log('🛒 API: Respuesta carrito:', response.data);
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al obtener carrito:', errorInfo);
      throw error;
    }
  },

  /**
   * Obtener carrito por id (cuando se usa carritoId persistido)
   */
  async obtenerCarritoPorId(id_carrito: string): Promise<Carrito | null> {
    try {
      const response = await api.get<ApiResponse<Carrito | null>>(
        `/carrito/${id_carrito}`
      );
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al obtener carrito por id:', errorInfo);
      throw error;
    }
  },

  /**
   * Crear carrito nuevo
   */
  async crearCarrito(usuarioId: number, id_canal: string = 'WEB'): Promise<Carrito> {
    console.log('🛒 API: Llamando POST /carrito', { clienteId: usuarioId, id_canal });
    try {
      const response = await api.post<ApiResponse<Carrito>>('/carrito', {
        clienteId: usuarioId,
        id_canal
      });
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al crear carrito:', errorInfo);
      throw error;
    }
  },

  /**
   * Agregar producto al carrito
   */
  async agregarProducto(
    id_carrito: string,
    id_producto: string,
    cantidad: number = 1,
    precio_referencial?: number
  ): Promise<Carrito> {
    try {
      const response = await api.post<ApiResponse<Carrito>>(
        `/carrito/${id_carrito}/productos`,
        {
          id_producto,
          cantidad,
          precio_referencial
        }
      );
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al agregar producto:', errorInfo);
      throw error;
    }
  },

  /**
   * Actualizar cantidad de producto
   */
  async actualizarCantidad(
    id_carrito: string,
    id_producto: string,
    cantidad: number
  ): Promise<Carrito> {
    try {
      const response = await api.put<ApiResponse<Carrito>>(
        `/carrito/${id_carrito}/productos/${id_producto}`,
        { cantidad }
      );
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al actualizar cantidad:', errorInfo);
      throw error;
    }
  },

  /**
   * Eliminar producto del carrito
   */
  async eliminarProducto(
    id_carrito: string,
    id_producto: string
  ): Promise<Carrito> {
    try {
      const response = await api.delete<ApiResponse<Carrito>>(
        `/carrito/${id_carrito}/productos/${id_producto}`
      );
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al eliminar producto:', errorInfo);
      throw error;
    }
  },

  /**
   * Vaciar carrito completo
   */
  async vaciarCarrito(id_carrito: string): Promise<Carrito> {
    try {
      const response = await api.delete<ApiResponse<Carrito>>(
        `/carrito/${id_carrito}`
      );
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al vaciar carrito:', errorInfo);
      throw error;
    }
  }
};
