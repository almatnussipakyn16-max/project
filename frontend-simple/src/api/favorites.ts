import api from './client';
import type { Favorite, PaginatedResponse, CreateFavoriteRequest } from './types';

export const favoritesApi = {
  /**
   * Get all favorites for the current user
   */
  getAll: async (): Promise<PaginatedResponse<Favorite>> => {
    const { data } = await api.get<PaginatedResponse<Favorite>>('/favorites/');
    return data;
  },

  /**
   * Add a restaurant to favorites
   */
  add: async (restaurantId: number): Promise<Favorite> => {
    const requestData: CreateFavoriteRequest = { restaurant: restaurantId };
    const { data } = await api.post<Favorite>('/favorites/', requestData);
    return data;
  },

  /**
   * Remove a restaurant from favorites
   */
  remove: async (id: number): Promise<void> => {
    await api.delete(`/favorites/${id}/`);
  },

  /**
   * Check if a restaurant is favorited
   */
  isFavorited: async (restaurantId: number): Promise<boolean> => {
    try {
      const response = await api.get<PaginatedResponse<Favorite>>('/favorites/');
      return response.data.results.some(fav => fav.restaurant.id === restaurantId);
    } catch (error) {
      return false;
    }
  },
};
