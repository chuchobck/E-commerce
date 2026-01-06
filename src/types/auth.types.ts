export interface Usuario {
  id_usuario: number;
  email: string;
  rol: string;
  tipo_usuario: string;
  cliente?: Cliente;
}

export interface Cliente {
  id_cliente: string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  ruc_cedula: string;
  telefono?: string | null;
  celular?: string | null;
  email?: string | null;
  direccion?: string;
  id_ciudad: string;
  estado?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  cliente: {
    id_cliente: string;
    nombre1: string;
    nombre2?: string;
    apellido1: string;
    apellido2?: string;
    ruc_cedula: string;
    telefono?: string | null;
    celular?: string | null;
    email?: string | null;
    direccion?: string;
    id_ciudad: string;
  };
  usuario: {
    email: string;
    password: string;
  };
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
