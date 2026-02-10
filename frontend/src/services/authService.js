import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/jwt/create/', { email, password });
    const { access, refresh } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/users/me/');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.patch('/auth/users/me/', userData);
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/users/set_password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};
