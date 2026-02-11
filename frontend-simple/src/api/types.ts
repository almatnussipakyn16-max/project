// Типы пользователей
export type UserRole = 'ADMIN' | 'RESTAURANT_OWNER' | 'STAFF' | 'CUSTOMER' | 'DEVELOPER';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  date_joined: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: UserRole;
}

// Типы ресторанов
export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  cuisine_types: string[];
  rating: number;
  total_reviews: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  image?: string;
  delivery_available: boolean;
  takeout_available: boolean;
  reservation_available: boolean;
  price_range: number;
  business_hours?: Record<string, { open: string; close: string }>;
  created_at: string;
  updated_at: string;
}

// Типы меню
export interface MenuCategory {
  id: number;
  restaurant: number;
  name: string;
  description?: string;
  display_order: number;
}

export interface MenuItem {
  id: number;
  category: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  is_available: boolean;
  is_featured: boolean;
  preparation_time: number;
  calories?: number;
  allergens?: string[];
  dietary_tags?: string[];
  created_at: string;
  updated_at: string;
}

// Типы заказов
export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type OrderType = 'DELIVERY' | 'TAKEOUT' | 'DINE_IN';

export interface OrderItem {
  id: number;
  menu_item: MenuItem;
  quantity: number;
  unit_price: string;
  subtotal: string;
  modifiers?: string[];
  special_instructions?: string;
}

export interface Order {
  id: number;
  order_number: string;
  restaurant: Restaurant;
  user: User;
  order_type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: string;
  tax: string;
  delivery_fee: string;
  discount: string;
  total: string;
  payment_method?: string;
  payment_status?: string;
  delivery_address?: DeliveryAddress;
  delivery_instructions?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

export interface CreateOrderRequest {
  restaurant: number;
  order_type: OrderType;
  items: {
    menu_item: number;
    quantity: number;
    modifiers?: string[];
    special_instructions?: string;
  }[];
  delivery_address?: DeliveryAddress;
  delivery_instructions?: string;
  payment_method?: string;
}

// Типы бронирований
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface Reservation {
  id: number;
  reservation_number: string;
  restaurant: Restaurant;
  user: User;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status: ReservationStatus;
  special_requests?: string;
  table_number?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReservationRequest {
  restaurant: number;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  special_requests?: string;
}

// Типы промокодов
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Promotion {
  id: number;
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: string;
  min_order_amount?: string;
  max_discount_amount?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  times_used: number;
}

export interface ApplyCouponRequest {
  code: string;
}

export interface ApplyCouponResponse {
  discount: string;
  new_total: string;
  message: string;
}

// Типы уведомлений
export type NotificationType = 'ORDER_UPDATE' | 'RESERVATION' | 'PROMOTION' | 'SYSTEM';

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  created_at: string;
}

// Типы поддержки
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface SupportTicket {
  id: number;
  ticket_number: string;
  user: User;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  category: string;
  priority?: TicketPriority;
}

// Типы платежей
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'CASH' | 'WALLET';

export interface Payment {
  id: number;
  order: number;
  amount: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id?: string;
  created_at: string;
}

// Пагинация
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Ошибки API
export interface ApiError {
  detail?: string;
  error?: string;
  message?: string;
  [key: string]: any;
}
