// Tipos para el flujo de checkout
export interface PuntoRetiro {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: {
    id: string;
    nombre: string;
  };
  horario: string;
  telefono?: string;
}

export interface MetodoPago {
  id: string;
  nombre: string;
  descripcion?: string;
  requiere_datos_adicionales: boolean;
  disponible_web: boolean;
}

export interface CheckoutData {
  carrito_id: string;
  metodo_pago_id: string;
  sucursal_retiro_id: string;
  datos_pago?: {
    numero_tarjeta?: string;
    nombre_titular?: string;
    fecha_expiracion?: string;
    cvv?: string;
  };
}

export interface CheckoutResponse {
  status: string;
  data: {
    factura: {
      id: string;
      numero_factura: string;
      fecha_emision: Date;
      subtotal: number;
      iva: number;
      total: number;
      estado_pago: string;
      estado_entrega: string;
    };
  };
  message: string;
}
