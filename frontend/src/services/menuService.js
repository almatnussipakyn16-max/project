import api from './api';

export const menuService = {
  async getCategories(restaurantId) {
    const response = await api.get('/menu/categories/', {
      params: { restaurant: restaurantId },
    });
    return response.data;
  },

  async getItems(params = {}) {
    const response = await api.get('/menu/items/', { params });
    return response.data;
  },

  async getItemById(id) {
    const response = await api.get(`/menu/items/${id}/`);
    return response.data;
  },

  async getItemsByCategory(categoryId) {
    const response = await api.get('/menu/items/', {
      params: { category: categoryId },
    });
    return response.data;
  },
};
