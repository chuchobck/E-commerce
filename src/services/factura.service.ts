import { api } from './api';

interface CrearFacturaPayload {
  clienteId: string;
  canal: 'WEB' | 'POS';
  pedidoId: string;
}

export const crearFactura = async (data: CrearFacturaPayload) => {
  const response = await api.post('/facturas', data);
  return response.data;
};

export const obtenerFactura = async (id: string) => {
  const response = await api.get(`/facturas/${id}`);
  return response.data;
};

export const listarFacturas = async () => {
  const response = await api.get('/facturas');
  return response.data;
};
