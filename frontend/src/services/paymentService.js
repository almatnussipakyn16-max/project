import api from './api';

export const paymentService = {
  async getAll(params = {}) {
    const response = await api.get('/payments/', { params });
    return response.data;
  },

  async createPayment(paymentData) {
    const response = await api.post('/payments/', paymentData);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/payments/${id}/`);
    return response.data;
  },
};
