import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

export const restaurantService = {
  getAll: async (params) => {
    const response = await api.get('/restaurants/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/restaurants/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/restaurants/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/restaurants/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/restaurants/${id}/`);
  },
};

export const menuService = {
  getMenuByRestaurant: async (restaurantId) => {
    const response = await api.get(`/restaurants/${restaurantId}/menu/`);
    return response.data;
  },

  getMenuItem: async (id) => {
    const response = await api.get(`/menu/items/${id}/`);
    return response.data;
  },

  createMenuItem: async (data) => {
    const response = await api.post('/menu/items/', data);
    return response.data;
  },

  updateMenuItem: async (id, data) => {
    const response = await api.put(`/menu/items/${id}/`, data);
    return response.data;
  },

  deleteMenuItem: async (id) => {
    await api.delete(`/menu/items/${id}/`);
  },
};

export const orderService = {
  getAll: async (params) => {
    const response = await api.get('/orders/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/orders/', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/`, { status });
    return response.data;
  },
};

export const reservationService = {
  getAll: async (params) => {
    const response = await api.get('/reservations/', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/reservations/', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/reservations/${id}/`, { status });
    return response.data;
  },
};
