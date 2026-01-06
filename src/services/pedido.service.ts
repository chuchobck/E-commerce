import { api } from './api';

interface CrearPedidoPayload {
  carritoId: string;
  canal: 'WEB';
}

export const crearPedido = async (data: CrearPedidoPayload) => {
  const response = await api.post('/pedidos', data);
  return response.data;
};
