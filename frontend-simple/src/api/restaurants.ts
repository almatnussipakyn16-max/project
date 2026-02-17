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
  /**
   * Get all restaurants with optional filters
   */
  getAll: async (filters?: RestaurantFilters): Promise<PaginatedResponse<Restaurant>> => {
    const { data } = await api.get<PaginatedResponse<Restaurant>>('/restaurants/', {
      params: filters,
    });
    return data;
  },

  /**
   * Get restaurant by ID
   */
  getById: async (id: number): Promise<Restaurant> => {
    // Validate ID
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      console.trace('Invalid restaurant ID:', id);
      throw new Error(`Invalid restaurant ID: ${id}`);
    }

    const { data } = await api.get<Restaurant>(`/restaurants/${id}/`);
    return data;
  },

  /**
   * Get restaurant menu
   */
  getMenu: async (restaurantId: number) => {
    // Validate ID
    if (typeof restaurantId !== 'number' || isNaN(restaurantId) || restaurantId <= 0) {
      console.trace('Invalid restaurant ID:', restaurantId);
      throw new Error(`Invalid restaurant ID: ${restaurantId}`);
    }

    const { data } = await api.get(`/restaurants/${restaurantId}/menu/`);
    return data;
  },
};
