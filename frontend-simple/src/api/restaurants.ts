import api from './client';
import type { Restaurant, PaginatedResponse } from './types';

export interface RestaurantFilters {
  search?: string;
  city?: string;
  cuisine_types?: string;
  page?: number;
  page_size?: number;
}

export const restaurantsApi = {
  // Получить список ресторанов
  getAll: async (filters?: RestaurantFilters): Promise<PaginatedResponse<Restaurant>> => {
    const { data } = await api.get<PaginatedResponse<Restaurant>>('/restaurants/', {
      params: filters,
    });
    return data;
  },

  // Получить детали ресторана
  getById: async (id: number): Promise<Restaurant> => {
    const { data } = await api.get<Restaurant>(`/restaurants/${id}/`);
    return data;
  },

  // Получить меню ресторана
  getMenu: async (restaurantId: number) => {
    const { data } = await api.get(`/restaurants/${restaurantId}/menu/`);
    return data;
  },
};
