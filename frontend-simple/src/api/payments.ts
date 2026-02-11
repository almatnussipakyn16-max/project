import api from './client';
import type { Payment, PaginatedResponse } from './types';

export const paymentsApi = {
  // Получить список платежей
  getAll: async (): Promise<PaginatedResponse<Payment>> => {
    const { data } = await api.get<PaginatedResponse<Payment>>('/payments/');
    return data;
  },

  // Получить платеж по ID
  getById: async (id: number): Promise<Payment> => {
    const { data } = await api.get<Payment>(`/payments/${id}/`);
    return data;
  },

  // Создать платеж
  createPayment: async (orderId: number, paymentData: any): Promise<Payment> => {
    const { data } = await api.post<Payment>('/payments/', {
      order: orderId,
      ...paymentData,
    });
    return data;
  },
};
