import { api } from './api';

interface CrearPagoPayload {
  pedidoId: string;
  metodo: 'PAYPAL' | 'TRANSFERENCIA';
  monto: number;
  referencia?: string;
}

interface DatosTarjeta {
  numero: string;
  titular: string;
  fechaExpiracion: string;
  cvv: string;
}

interface PagarConTarjetaPayload {
  pedidoId: string;
  datosTarjeta: DatosTarjeta;
}

export const crearPago = async (data: CrearPagoPayload) => {
  const response = await api.post('/pagos', data);
  return response.data;
};

export const pagarConTarjeta = async (data: PagarConTarjetaPayload) => {
  const response = await api.post('/pagos/tarjeta', data);
  return response.data;
};

export const obtenerPagosPorUsuario = async (usuarioId: number) => {
  const response = await api.get('/pagos', {
    params: { usuarioId }
  });
  return response.data;
};
