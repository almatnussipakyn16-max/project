import api from './client';
import type { Order, CreateOrderRequest, PaginatedResponse, OrderStatus } from './types';

export const ordersApi = {
  // Получить список заказов
  getAll: async (params?: { status?: OrderStatus }): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get<PaginatedResponse<Order>>('/orders/', {
      params,
    });
    return data;
  },

  // Получить заказ по ID
  getById: async (id: number): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/${id}/`);
    return data;
  },

  // Создать заказ
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const { data } = await api.post<Order>('/orders/', orderData);
    return data;
  },

  // Отменить заказ
  cancel: async (id: number): Promise<Order> => {
    const { data } = await api.patch<Order>(`/orders/${id}/`, {
      status: 'CANCELLED',
    });
    return data;
  },

  // Обновить статус заказа
  updateStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch<Order>(`/orders/${id}/`, { status });
    return data;
  },
};
