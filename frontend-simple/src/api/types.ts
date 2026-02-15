import api from './api';

export const promotionsApi = {
  async getAll(params = {}) {
    const response = await api.get('promotions/', { params });
    return response;
  },

  async getById(id: number) {
    const response = await api.get(`promotions/${id}/`);
    return response;
  },

  async validate(code: string) {
    const response = await api.post('promotions/validate/', { code });
    return response;
  },
};