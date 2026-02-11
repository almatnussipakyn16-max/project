import api from './client';
import type { MenuItem, MenuCategory, PaginatedResponse } from './types';

export const menuApi = {
  // Получить категории меню
  getCategories: async (restaurantId?: number): Promise<PaginatedResponse<MenuCategory>> => {
    const { data } = await api.get<PaginatedResponse<MenuCategory>>('/menu/categories/', {
      params: restaurantId ? { restaurant: restaurantId } : {},
    });
    return data;
  },

  // Получить позиции меню
  getItems: async (params?: { restaurant?: number; category?: number }): Promise<PaginatedResponse<MenuItem>> => {
    const { data } = await api.get<PaginatedResponse<MenuItem>>('/menu/items/', {
      params,
    });
    return data;
  },

  // Получить позицию меню по ID
  getItemById: async (id: number): Promise<MenuItem> => {
    const { data } = await api.get<MenuItem>(`/menu/items/${id}/`);
    return data;
  },
};
