import api from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from './types';

export const authApi = {
  // Вход
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/jwt/create/', credentials);
    return data;
  },

  // Регистрация
  register: async (userData: RegisterRequest): Promise<User> => {
    const { data } = await api.post<User>('/auth/users/', userData);
    return data;
  },

  // Получить текущего пользователя
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/users/me/');
    return data;
  },

  // Обновить профиль
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await api.patch<User>('/auth/users/me/', updates);
    return data;
  },

  // Выход (очистка токенов на клиенте)
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
