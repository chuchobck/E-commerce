// =============================================
// ⭐ SERVICIO DE FAVORITOS
// =============================================
import { api } from './api';
import { getErrorInfo } from '../utils/errorHandler';
import { Favorito } from '../types/catalogo.types';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export const favoritosService = {
  /**
   * Obtener favoritos del usuario
   */
  async obtenerFavoritos(usuarioId: number): Promise<Favorito[]> {
    console.log('❤️ API: Llamando GET /favoritos?usuarioId=' + usuarioId);
    try {
      const response = await api.get<ApiResponse<Favorito[]>>(
        `/favoritos?usuarioId=${usuarioId}`
      );
      console.log('❤️ API: Respuesta favoritos:', response.data);
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al obtener favoritos:', errorInfo);
      throw error;
    }
  },

  /**
   * Agregar producto a favoritos
   */
  async agregarFavorito(usuarioId: number, productoId: string): Promise<Favorito> {
    console.log('❤️ API: Llamando POST /favoritos con usuarioId:', usuarioId, 'productoId:', productoId);
    try {
      const response = await api.post<ApiResponse<Favorito>>('/favoritos', {
        usuarioId,
        productoId
      });
      console.log('❤️ API: Favorito agregado:', response.data);
      return response.data.data;
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al agregar favorito:', errorInfo);
      throw error;
    }
  },

  /**
   * Eliminar producto de favoritos
   */
  async eliminarFavorito(id_favorito: number): Promise<void> {
    console.log('❤️ API: Llamando DELETE /favoritos/' + id_favorito);
    try {
      await api.delete<ApiResponse<null>>(`/favoritos/${id_favorito}`);
      console.log('❤️ API: Favorito eliminado');
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      console.error('❌ Error al eliminar favorito:', errorInfo);
      throw error;
    }
  }
};
