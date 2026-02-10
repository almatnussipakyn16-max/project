import api from './api';

export const promotionService = {
  async getAll(params = {}) {
    const response = await api.get('/promotions/', { params });
    return response.data;
  },

  async validate(code, orderTotal, restaurantId) {
    const response = await api.post('/promotions/validate/', {
      code,
      order_total: orderTotal,
      restaurant: restaurantId,
    });
    return response.data;
  },

  async getActive(restaurantId = null) {
    const params = { is_active: true };
    if (restaurantId) params.restaurant = restaurantId;
    
    const response = await api.get('/promotions/', { params });
    return response.data;
  },
};
