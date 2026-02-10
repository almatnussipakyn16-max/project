import api from './api';

export const restaurantService = {
  async getAll(params = {}) {
    const response = await api.get('/restaurants/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/restaurants/${id}/`);
    return response.data;
  },

  async search(query) {
    const response = await api.get('/restaurants/', {
      params: { search: query },
    });
    return response.data;
  },

  async getReviews(restaurantId) {
    const response = await api.get(`/restaurants/${restaurantId}/reviews/`);
    return response.data;
  },

  async createReview(restaurantId, data) {
    const response = await api.post(`/restaurants/${restaurantId}/reviews/`, data);
    return response.data;
  },
};
