import { api } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, Usuario } from '../types/auth.types';

export const authService = {
  // Login con backend
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('barbox_token', response.data.data.token);
      localStorage.setItem('barbox_user', JSON.stringify(response.data.data.usuario));
    }
    return response.data;
  },

  // Registro con backend
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/registro', data);
      if (response.data.data.token) {
        localStorage.setItem('barbox_token', response.data.data.token);
        localStorage.setItem('barbox_user', JSON.stringify(response.data.data.usuario));
      }
      return response.data;
    } catch (error: any) {
      console.error('Error en registro:', error.response?.data);
      throw error;
    }
  },

  // Verificar sesión con backend
  async verifySession(): Promise<boolean> {
    try {
      const response = await api.get('/auth/perfil');
      if (response.data.status === 'success') {
        localStorage.setItem('barbox_user', JSON.stringify(response.data.data));
        return true;
      }
      return false;
    } catch (error) {
      this.logout();
      return false;
    }
  },

  // Logout
  logout(): void {
    localStorage.removeItem('barbox_token');
    localStorage.removeItem('barbox_user');
  },

  // Obtener usuario actual
  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('barbox_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('barbox_token');
  },
};
