import api from './client';
import type { Promotion, ApplyCouponRequest, ApplyCouponResponse, PaginatedResponse } from './types';

export const promotionsApi = {
  // Получить список промокодов
  getAll: async (): Promise<PaginatedResponse<Promotion>> => {
    const { data } = await api.get<PaginatedResponse<Promotion>>('/promotions/');
    return data;
  },

  // Получить промокод по коду
  getByCode: async (code: string): Promise<Promotion> => {
    const { data } = await api.get<Promotion>(`/promotions/${code}/`);
    return data;
  },

  // Применить промокод к заказу
  applyCoupon: async (orderId: number, couponData: ApplyCouponRequest): Promise<ApplyCouponResponse> => {
    const { data } = await api.post<ApplyCouponResponse>(
      `/orders/${orderId}/apply-coupon/`,
      couponData
    );
    return data;
  },
};
