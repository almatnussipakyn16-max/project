import api from './api';

export const restaurantService = {
  async getAll(params = {}) {
    const response = await api.get('/api/restaurants/', { params }); // ← ADD /api/
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/restaurants/${id}/`); // ← ADD /api/
    return response.data;
  },

  async search(query) {
    const response = await api.get('/api/restaurants/', { // ← ADD /api/
      params: { search: query },
    });
    return response.data;
  },

  async getReviews(restaurantId) {
    const response = await api.get(`/api/restaurants/${restaurantId}/reviews/`); // ← ADD /api/
    return response.data;
  },

  async createReview(restaurantId, data) {
    const response = await api.post(`/api/restaurants/${restaurantId}/reviews/`, data); // ← ADD /api/
    return response.data;
  },
};