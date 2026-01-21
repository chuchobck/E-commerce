export interface Usuario {
  id_usuario: number;
  usuario: string;  // ✅ Cambiado de 'email' a 'usuario'
  rol: string;
  tipo_usuario: string;
  cliente?: Cliente;
}

export interface Cliente {
  id_cliente: number;  // ✅ Cambiado a number
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  ruc_cedula: string;
  telefono?: string | null;
  celular?: string | null;  // ✅ Campo celular agregado
  email?: string | null;  // ✅ Email ahora es opcional
  direccion?: string;
  id_ciudad?: string;
  estado?: string;
}

export interface LoginRequest {
  usuario: string;  // ✅ Cambiado de 'email' a 'usuario'
  password: string;
}

export interface RegisterRequest {
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  ruc_cedula: string;
  usuario: string;  // ✅ NUEVO: campo obligatorio para login
  password: string;
  telefono?: string;
  celular?: string;  // ✅ Agregado campo celular
  email?: string;  // ✅ Opcional
  direccion?: string;
  id_ciudad?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
    usuario: Usuario;
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
}
