import api from './client';
import type { Reservation, PaginatedResponse } from './types';

export interface CreateReservationRequest {
  restaurant: number;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;  // ✅ guest_count, не party_size
  special_requests?: string;
}

export const reservationsApi = {
  // Получить все бронирования пользователя
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
    const { data } = await api.post<Reservation>(`/reservations/${id}/cancel/`);
    return data;
  },
};