import api from './client';
import type { Reservation, CreateReservationRequest, PaginatedResponse } from './types';

export const reservationsApi = {
  // Получить список бронирований
  getAll: async (): Promise<PaginatedResponse<Reservation>> => {
    const { data } = await api.get<PaginatedResponse<Reservation>>('/reservations/');
    return data;
  },

  // Получить бронирование по ID
  getById: async (id: number): Promise<Reservation> => {
    const { data } = await api.get<Reservation>(`/reservations/${id}/`);
    return data;
  },

  // Создать бронирование
  create: async (reservationData: CreateReservationRequest): Promise<Reservation> => {
    const { data } = await api.post<Reservation>('/reservations/', reservationData);
    return data;
  },

  // Отменить бронирование
  cancel: async (id: number): Promise<Reservation> => {
    const { data } = await api.patch<Reservation>(`/reservations/${id}/`, {
      status: 'CANCELLED',
    });
    return data;
  },
};
