import api from './axios';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from './types';

export const authApi = {
  /**
   * User login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/jwt/create/', credentials);
    return data;
  },

  /**
   * User registration
   */
  register: async (userData: RegisterRequest): Promise<User> => {
    const { data } = await api.post<User>('/auth/users/', userData);
    return data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/users/me/');
    return data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await api.patch<User>('/auth/users/me/', updates);
    return data;
  },

  /**
   * Logout (clear tokens on client)
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
