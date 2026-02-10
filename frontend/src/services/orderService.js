import api from './api';

export const orderService = {
  async getAll(params = {}) {
    const response = await api.get('/orders/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  async create(orderData) {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  async applyPromo(orderId, promoCode) {
    const response = await api.post(`/orders/${orderId}/apply_promo/`, {
      code: promoCode,
    });
    return response.data;
  },

  async cancelOrder(orderId) {
    const response = await api.post(`/orders/${orderId}/cancel_order/`);
    return response.data;
  },

  async trackOrder(orderId) {
    const response = await api.get(`/orders/${orderId}/track/`);
    return response.data;
  },

  async updateStatus(orderId, status) {
    const response = await api.patch(`/orders/${orderId}/update_status/`, {
      status,
    });
    return response.data;
  },
};
