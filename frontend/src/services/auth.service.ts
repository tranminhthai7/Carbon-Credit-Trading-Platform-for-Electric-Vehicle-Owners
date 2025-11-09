import { apiClient } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authService = {
  // User authentication
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/users/login', credentials);
    // Backend returns { success, message, data: { user, token } }
    const authData = response.data.data;
    if (authData.token) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
    return authData;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/users/register', data);
    // Backend returns { success, message, data: { user, token } }
    const authData = response.data.data;
    if (authData.token) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
    return authData;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/users/profile');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/api/users/${userId}`, data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },
};
