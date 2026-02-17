import api from './client';
import type { Notification, PaginatedResponse } from './types';

export const notificationsApi = {
  /**
   * Get all notifications for the current user
   */
  getAll: async (): Promise<PaginatedResponse<Notification>> => {
    const { data } = await api.get<PaginatedResponse<Notification>>('/notifications/');
    return data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: number): Promise<Notification> => {
    const { data } = await api.patch<Notification>(`/notifications/${id}/mark_as_read/`);
    return data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ message: string; count: number }> => {
    const { data } = await api.post<{ message: string; count: number }>('/notifications/mark_all_as_read/');
    return data;
  },

  /**
   * Get count of unread notifications
   */
  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get<{ count: number }>('/notifications/unread_count/');
    return data.count;
  },
};
