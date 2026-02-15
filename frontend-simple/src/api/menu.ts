import api from './client';
import type { MenuItem, PaginatedResponse } from './types';

export const menuApi = {
  // Получить меню ресторана
  getByRestaurant: async (restaurantId: number): Promise<PaginatedResponse<MenuItem>> => {
    const { data } = await api.get<PaginatedResponse<MenuItem>>(`/menu/items/?restaurant=${restaurantId}`);
    return data;
  },

  // Получить блюдо по ID
  getById: async (id: number): Promise<MenuItem> => {
    const { data } = await api.get<MenuItem>(`/menu/items/${id}/`);
    return data;
  },
};