import api from './axios';
import type { 
  Restaurant, 
  MenuItem, 
  Table, 
  Order, 
  Reservation, 
  PaginatedResponse 
} from './types';

/**
 * Owner API for restaurant management
 * All endpoints require RESTAURANT_OWNER role
 */
export const ownerApi = {
  // ==========================================
  // RESTAURANT MANAGEMENT
  // ==========================================
  
  /**
   * Get owner's restaurant
   */
  getRestaurant: async (): Promise<Restaurant> => {
    const { data } = await api.get<Restaurant>('/restaurants/owner/restaurant/');
    return data;
  },

  /**
   * Update owner's restaurant
   */
  updateRestaurant: async (restaurantData: Partial<Restaurant>): Promise<Restaurant> => {
    const { data } = await api.patch<Restaurant>('/restaurants/owner/restaurant/0/', restaurantData);
    return data;
  },

  // ==========================================
  // MENU MANAGEMENT
  // ==========================================
  
  /**
   * Get all menu items for owner's restaurant
   */
  getMenu: async (): Promise<MenuItem[]> => {
    const { data } = await api.get<MenuItem[]>('/restaurants/owner/menu/');
    return data;
  },

  /**
   * Get a specific menu item
   */
  getMenuItem: async (id: number): Promise<MenuItem> => {
    const { data } = await api.get<MenuItem>(`/restaurants/owner/menu/${id}/`);
    return data;
  },

  /**
   * Create a new menu item
   */
  createMenuItem: async (itemData: Partial<MenuItem>): Promise<MenuItem> => {
    const { data } = await api.post<MenuItem>('/restaurants/owner/menu/', itemData);
    return data;
  },

  /**
   * Update a menu item
   */
  updateMenuItem: async (id: number, itemData: Partial<MenuItem>): Promise<MenuItem> => {
    const { data } = await api.patch<MenuItem>(`/restaurants/owner/menu/${id}/`, itemData);
    return data;
  },

  /**
   * Delete a menu item
   */
  deleteMenuItem: async (id: number): Promise<void> => {
    await api.delete(`/restaurants/owner/menu/${id}/`);
  },

  // ==========================================
  // TABLE MANAGEMENT
  // ==========================================
  
  /**
   * Get all tables for owner's restaurant
   */
  getTables: async (): Promise<Table[]> => {
    const { data } = await api.get<Table[]>('/restaurants/owner/tables/');
    return data;
  },

  /**
   * Create a new table
   */
  createTable: async (tableData: Partial<Table>): Promise<Table> => {
    const { data } = await api.post<Table>('/restaurants/owner/tables/', tableData);
    return data;
  },

  /**
   * Update a table
   */
  updateTable: async (id: number, tableData: Partial<Table>): Promise<Table> => {
    const { data } = await api.patch<Table>(`/restaurants/owner/tables/${id}/`, tableData);
    return data;
  },

  /**
   * Delete a table
   */
  deleteTable: async (id: number): Promise<void> => {
    await api.delete(`/restaurants/owner/tables/${id}/`);
  },

  // ==========================================
  // ORDER MANAGEMENT
  // ==========================================
  
  /**
   * Get all orders for owner's restaurant
   */
  getOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>('/restaurants/owner/orders/');
    return data;
  },

  /**
   * Get a specific order
   */
  getOrder: async (id: number): Promise<Order> => {
    const { data } = await api.get<Order>(`/restaurants/owner/orders/${id}/`);
    return data;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const { data } = await api.patch<Order>(
      `/restaurants/owner/orders/${id}/update_status/`,
      { status }
    );
    return data;
  },

  // ==========================================
  // RESERVATION MANAGEMENT
  // ==========================================
  
  /**
   * Get all reservations for owner's restaurant
   */
  getReservations: async (): Promise<Reservation[]> => {
    const { data } = await api.get<Reservation[]>('/restaurants/owner/reservations/');
    return data;
  },

  /**
   * Get a specific reservation
   */
  getReservation: async (id: number): Promise<Reservation> => {
    const { data } = await api.get<Reservation>(`/restaurants/owner/reservations/${id}/`);
    return data;
  },

  /**
   * Confirm a reservation
   */
  confirmReservation: async (id: number): Promise<Reservation> => {
    const { data } = await api.patch<Reservation>(
      `/restaurants/owner/reservations/${id}/confirm/`
    );
    return data;
  },

  /**
   * Reject a reservation
   */
  rejectReservation: async (id: number): Promise<Reservation> => {
    const { data } = await api.patch<Reservation>(
      `/restaurants/owner/reservations/${id}/reject/`
    );
    return data;
  },
};
