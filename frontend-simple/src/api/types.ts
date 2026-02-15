// ==========================================
// TypeScript Type Definitions for Frontend
// Matching Backend Django Models
// ==========================================

// ==========================================
// PAGINATION
// ==========================================
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ==========================================
// USER
// ==========================================
export type UserRole = 'ADMIN' | 'RESTAURANT_OWNER' | 'STAFF' | 'CUSTOMER' | 'DEVELOPER';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  date_of_birth?: string;
  bio?: string;
  is_email_verified: boolean;
  is_2fa_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_login_ip?: string;
  is_active: boolean;
  is_staff: boolean;
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

// ==========================================
// RESTAURANT
// ==========================================
export type RestaurantStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
export type PriceRange = 1 | 2 | 3 | 4;

export interface Restaurant {
  id: number;
  owner: number;
  name: string;
  slug: string;
  description: string;
  email: string;
  phone: string;
  website?: string;
  
  // Address
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  
  // Images
  logo?: string;
  cover_image?: string;
  
  // Business Info
  cuisine_types: string[];
  price_range: PriceRange;
  status: RestaurantStatus;
  
  // Rating
  rating: number;
  total_reviews: number;
  
  // Features
  delivery_available: boolean;
  takeout_available: boolean;
  reservation_available: boolean;
  
  business_hours?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ==========================================
// MENU
// ==========================================
export interface MenuCategory {
  id: number;
  restaurant: number;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  category: number;
  restaurant?: number;
  name: string;
  description: string;
  price: string | number; // Backend sends as string, we parse to number
  image?: string;
  
  // Nutritional
  calories?: number;
  allergens?: string[];
  dietary_tags?: string[];
  
  // Availability
  is_available: boolean;
  is_featured: boolean;
  preparation_time: number;
  
  // Tracking
  order_count: number;
  created_at: string;
  updated_at: string;
}

// ==========================================
// ORDER
// ==========================================
export type OrderType = 'DELIVERY' | 'TAKEOUT' | 'DINE_IN';
export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface OrderItem {
  id?: number;
  menu_item: number;
  menu_item_details?: MenuItem;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
  special_instructions?: string;
  modifiers?: Array<Record<string, any>>;
}

export interface Order {
  id: number;
  order_number: string;
  user: number;
  restaurant: number;
  restaurant_details?: Restaurant;
  order_type: OrderType;
  status: OrderStatus;
  
  // Items
  items: OrderItem[];
  
  // Pricing
  subtotal: string | number;
  tax: string | number;
  delivery_fee: string | number;
  discount: string | number;
  total: string | number;
  
  // Delivery
  delivery_address?: Record<string, any>;
  delivery_instructions?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  restaurant: number;
  order_type: OrderType;
  items: Array<{
    menu_item: number;
    quantity: number;
    special_instructions?: string;
  }>;
  delivery_address?: Record<string, any>;
  delivery_instructions?: string;
  promo_code?: string;
}

// ==========================================
// RESERVATION
// ==========================================
export type ReservationStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'SEATED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export interface Reservation {
  id: number;
  reservation_number: string;
  user: number;
  restaurant: number;
  restaurant_details?: Restaurant;
  table?: number;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status: ReservationStatus;
  special_requests?: string;
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

// ==========================================
// PAYMENT
// ==========================================
export type PaymentMethod = 'CARD' | 'CASH' | 'WALLET';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: number;
  order: number;
  payment_method: PaymentMethod;
  amount: string | number;
  status: PaymentStatus;
  transaction_id?: string;
  payment_date?: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// PROMOTION
// ==========================================
export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface Promotion {
  id: number;
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: string | number;
  min_order_amount?: string | number;
  max_discount_amount?: string | number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit?: number;
  used_count: number;
  created_at: string;
  updated_at: string;
}

export interface ApplyCouponRequest {
  code: string;
  order_total: number;
}

export interface ApplyCouponResponse {
  valid: boolean;
  discount_amount: number;
  message: string;
}

// ==========================================
// NOTIFICATION
// ==========================================
export type NotificationType = 'ORDER' | 'RESERVATION' | 'PROMOTION' | 'SYSTEM';

export interface Notification {
  id: number;
  user: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ==========================================
// SUPPORT
// ==========================================
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface SupportTicket {
  id: number;
  ticket_number: string;
  user: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  priority?: TicketPriority;
}