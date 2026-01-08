/**
 * CONFIGURACIÓN DE API PARA CREATE REACT APP
 */

// Obtener URL base de la API
const getApiBaseUrl = (): string => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    return envUrl.replace('/api/v1', '');
  }
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
export const IMAGE_BASE_URL = API_BASE_URL;

export const getImagenProductoUrl = (nombreArchivo?: string | null): string => {
  if (!nombreArchivo) {
    return 'https://placehold.co/300?text=Sin+imagen';
  }
  return `${IMAGE_BASE_URL}/productos/${nombreArchivo}`;
};

export const getLogoMarcaUrl = (nombreArchivo?: string | null): string => {
  if (!nombreArchivo) {
    return 'https://placehold.co/100?text=Sin+logo';
  }
  return `${IMAGE_BASE_URL}/logos/${nombreArchivo}`;
};

export const getPromocionUrl = (nombreArchivo?: string | null): string => {
  if (!nombreArchivo) {
    return 'https://placehold.co/1200x400?text=Promoción';
  }
  return `${IMAGE_BASE_URL}/promociones/${nombreArchivo}`;
};

export const PLACEHOLDER_PRODUCTO = 'https://placehold.co/300?text=Sin+imagen';
export const PLACEHOLDER_LOGO = 'https://placehold.co/100?text=Sin+logo';
export const PLACEHOLDER_PROMOCION = 'https://placehold.co/1200x400?text=Promoción';

if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    API_URL,
    API_BASE_URL,
    IMAGE_BASE_URL
  });
}
