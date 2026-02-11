import api from './client';
import type { SupportTicket, CreateTicketRequest, PaginatedResponse } from './types';

export const supportApi = {
  // Получить список тикетов
  getAll: async (): Promise<PaginatedResponse<SupportTicket>> => {
    const { data } = await api.get<PaginatedResponse<SupportTicket>>('/support/tickets/');
    return data;
  },

  // Получить тикет по ID
  getById: async (id: number): Promise<SupportTicket> => {
    const { data } = await api.get<SupportTicket>(`/support/tickets/${id}/`);
    return data;
  },

  // Создать тикет
  create: async (ticketData: CreateTicketRequest): Promise<SupportTicket> => {
    const { data } = await api.post<SupportTicket>('/support/tickets/', ticketData);
    return data;
  },

  // Обновить тикет
  update: async (id: number, updates: Partial<SupportTicket>): Promise<SupportTicket> => {
    const { data } = await api.patch<SupportTicket>(`/support/tickets/${id}/`, updates);
    return data;
  },
};
