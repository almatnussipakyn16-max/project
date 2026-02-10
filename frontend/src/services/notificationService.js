import api from './api';

export const notificationService = {
  async getAll(params = {}) {
    const response = await api.get('/notifications/', { params });
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/`, {
      is_read: true,
    });
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/mark_all_read/');
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/', {
      params: { is_read: false },
    });
    return response.data.count || 0;
  },
};
