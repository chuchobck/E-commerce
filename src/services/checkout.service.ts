import { api } from './api';
import { PuntoRetiro, MetodoPago, CheckoutData, CheckoutResponse } from '../types/checkout.types';

export const checkoutService = {
  // Obtener puntos de retiro disponibles
  async getPuntosRetiro(): Promise<PuntoRetiro[]> {
    const response = await api.get('/sucursales/puntos-retiro');
    return response.data.data;
  },

  // Obtener métodos de pago disponibles para web
  async getMetodosPago(): Promise<MetodoPago[]> {
    const response = await api.get('/metodos-pago/disponibles-web');
    return response.data.data;
  },

  // Procesar checkout
  async procesarCheckout(data: CheckoutData): Promise<CheckoutResponse> {
    const response = await api.post<CheckoutResponse>('/facturas/checkout', data);
    
    // Limpiar carrito del localStorage después de checkout exitoso
    if (response.data.status === 'success') {
      localStorage.removeItem('barbox_cart_id');
      localStorage.removeItem('barbox_session_id');
    }
    
    return response.data;
  },

  // Obtener mis pedidos
  async getMisPedidos() {
    const response = await api.get('/facturas/mis-pedidos');
    return response.data;
  },
};
