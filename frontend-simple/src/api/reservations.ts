import api from './axios';
import type { Reservation, PaginatedResponse } from './types';

export interface CreateReservationRequest {
  restaurant: number;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  special_requests?: string;
}

export const reservationsApi = {
  /**
   * Get all reservations for the current user
   */
  getAll: async (): Promise<PaginatedResponse<Reservation>> => {
    const { data } = await api.get<PaginatedResponse<Reservation>>('/reservations/');
    return data;
  },

  /**
   * Get a reservation by ID
   */
  getById: async (id: number): Promise<Reservation> => {
    const { data } = await api.get<Reservation>(`/reservations/${id}/`);
    return data;
  },

  /**
   * Create a new reservation
   */
  create: async (reservationData: CreateReservationRequest): Promise<Reservation> => {
    const { data } = await api.post<Reservation>('/reservations/', reservationData);
    return data;
  },

  /**
   * Cancel a reservation
   */
  cancel: async (id: number): Promise<Reservation> => {
    const { data } = await api.post<Reservation>(`/reservations/${id}/cancel/`);
    return data;
  },
};