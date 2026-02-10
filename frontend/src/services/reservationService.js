import api from './api';

export const reservationService = {
  async getAll(params = {}) {
    const response = await api.get('/reservations/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/reservations/${id}/`);
    return response.data;
  },

  async create(reservationData) {
    const response = await api.post('/reservations/', reservationData);
    return response.data;
  },

  async checkAvailability(data) {
    const response = await api.post('/reservations/check_availability/', data);
    return response.data;
  },

  async confirm(id) {
    const response = await api.post(`/reservations/${id}/confirm/`);
    return response.data;
  },

  async cancel(id) {
    const response = await api.post(`/reservations/${id}/cancel/`);
    return response.data;
  },
};
