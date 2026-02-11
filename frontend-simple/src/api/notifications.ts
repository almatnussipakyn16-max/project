import api from './client';
import type { Notification, PaginatedResponse } from './types';

export const notificationsApi = {
  // Получить список уведомлений
  getAll: async (): Promise<PaginatedResponse<Notification>> => {
    const { data } = await api.get<PaginatedResponse<Notification>>('/notifications/');
    return data;
  },

  // Отметить уведомление как прочитанное
  markAsRead: async (id: number): Promise<Notification> => {
    const { data } = await api.patch<Notification>(`/notifications/${id}/`, {
      is_read: true,
    });
    return data;
  },

  // Отметить все уведомления как прочитанные
  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/mark-all-read/');
  },
};
