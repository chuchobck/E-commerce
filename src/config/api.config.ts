/**
 * Configuración de URLs para imágenes del backend
 * 
 * El backend sirve imágenes desde tres directorios:
 * - /logos → {API_URL}/logos/
 * - /productos → {API_URL}/productos/
 * - /promociones → {API_URL}/promociones/
 */

// Usar variable de entorno o localhost como fallback para desarrollo
export const IMAGE_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

/**
 * Construye la URL completa de una imagen de producto
 * @param nombreArchivo - Nombre del archivo desde la BD (ej: "1.webp")
 * @returns URL completa (ej: "http://localhost:3000/productos/1.webp")
 */
export const getImagenProductoUrl = (nombreArchivo?: string | null): string => {
  if (!nombreArchivo) {
    return 'https://placehold.co/300?text=Sin+imagen';
  }
  return `${IMAGE_BASE_URL}/productos/${nombreArchivo}`;
};

/**
 * Construye la URL completa de un logo de marca
 * @param nombreArchivo - Nombre del archivo desde la BD (ej: "1.webp")
 * @returns URL completa (ej: "http://localhost:3000/logos/1.webp")
 */
export const getLogoMarcaUrl = (nombreArchivo?: string | null): string => {
  if (!nombreArchivo) {
    return 'https://placehold.co/100?text=Sin+logo';
  }
  return `${IMAGE_BASE_URL}/logos/${nombreArchivo}`;
};

/**
 * Construye la URL completa de una imagen de promoción
 * @param nombreArchivo - Nombre del archivo desde la BD (ej: "1.webp")
 * @returns URL completa (ej: "http://localhost:3000/promociones/1.webp")
 */
export const getPromocionUrl = (nombreArchivo?: string | null): string => {
  if (!nombreArchivo) {
    return 'https://placehold.co/1200x400?text=Promoción';
  }
  return `${IMAGE_BASE_URL}/promociones/${nombreArchivo}`;
};

/**
 * Usa esto en un manejador de error de imagen
 * Ej: <img onError={(e) => { e.currentTarget.src = PLACEHOLDER_PRODUCTO; }} />
 */
export const PLACEHOLDER_PRODUCTO = 'https://placehold.co/300?text=Sin+imagen';
export const PLACEHOLDER_LOGO = 'https://placehold.co/100?text=Sin+logo';
export const PLACEHOLDER_PROMOCION = 'https://placehold.co/1200x400?text=Promoción';
