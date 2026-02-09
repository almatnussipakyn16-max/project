# API Documentation

## Base URL
- Development: `http://localhost:8000/api`
- Production: `https://api.yourdomain.com`

## Authentication

### Register
**POST** `/auth/register/`

Request:
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "CUSTOMER"
}
\`\`\`

Response:
\`\`\`json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "CUSTOMER"
}
\`\`\`

### Login
**POST** `/auth/login/`

Request:
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
\`\`\`

Response:
\`\`\`json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "CUSTOMER"
  }
}
\`\`\`

## Restaurants

### List Restaurants
**GET** `/restaurants/`

Query Parameters:
- `search` - Search by name or description
- `city` - Filter by city
- `cuisine_types` - Filter by cuisine
- `page` - Page number
- `page_size` - Results per page

Response:
\`\`\`json
{
  "count": 50,
  "next": "http://api.example.com/restaurants/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Italian Bistro",
      "slug": "italian-bistro",
      "description": "Authentic Italian cuisine",
      "rating": 4.5,
      "total_reviews": 120,
      "city": "New York",
      "cuisine_types": ["Italian", "Mediterranean"],
      "price_range": 3
    }
  ]
}
\`\`\`

### Get Restaurant Details
**GET** `/restaurants/{id}/`

Response:
\`\`\`json
{
  "id": 1,
  "name": "Italian Bistro",
  "slug": "italian-bistro",
  "description": "Authentic Italian cuisine",
  "email": "info@italianbistro.com",
  "phone": "+1234567890",
  "address_line1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "rating": 4.5,
  "total_reviews": 120,
  "business_hours": {
    "monday": {"open": "11:00", "close": "22:00"},
    "tuesday": {"open": "11:00", "close": "22:00"}
  },
  "delivery_available": true,
  "takeout_available": true,
  "reservation_available": true
}
\`\`\`

## Menu

### Get Restaurant Menu
**GET** `/restaurants/{restaurant_id}/menu/`

Response:
\`\`\`json
{
  "categories": [
    {
      "id": 1,
      "name": "Appetizers",
      "description": "Start your meal",
      "items": [
        {
          "id": 1,
          "name": "Bruschetta",
          "description": "Toasted bread with tomatoes",
          "price": "8.99",
          "calories": 150,
          "allergens": ["gluten"],
          "dietary_tags": ["vegetarian"],
          "is_available": true,
          "is_featured": true
        }
      ]
    }
  ]
}
\`\`\`

## Orders

### Create Order
**POST** `/orders/`

Request:
\`\`\`json
{
  "restaurant": 1,
  "order_type": "DELIVERY",
  "items": [
    {
      "menu_item": 1,
      "quantity": 2,
      "modifiers": ["extra cheese"],
      "special_instructions": "No onions"
    }
  ],
  "delivery_address": {
    "address_line1": "456 Oak St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001"
  },
  "delivery_instructions": "Ring doorbell"
}
\`\`\`

Response:
\`\`\`json
{
  "id": 1,
  "order_number": "ORD-20231201-001",
  "status": "PENDING",
  "subtotal": "17.98",
  "tax": "1.80",
  "delivery_fee": "3.00",
  "total": "22.78",
  "estimated_delivery_time": "2023-12-01T19:30:00Z"
}
\`\`\`

### Get Order Status
**GET** `/orders/{id}/`

Response:
\`\`\`json
{
  "id": 1,
  "order_number": "ORD-20231201-001",
  "status": "CONFIRMED",
  "restaurant": {
    "id": 1,
    "name": "Italian Bistro"
  },
  "items": [...],
  "total": "22.78",
  "created_at": "2023-12-01T18:30:00Z",
  "estimated_delivery_time": "2023-12-01T19:30:00Z"
}
\`\`\`

## Reservations

### Create Reservation
**POST** `/reservations/`

Request:
\`\`\`json
{
  "restaurant": 1,
  "reservation_date": "2023-12-15",
  "reservation_time": "19:00:00",
  "guest_count": 4,
  "special_requests": "Window seat if available"
}
\`\`\`

Response:
\`\`\`json
{
  "id": 1,
  "reservation_number": "RES-20231201-001",
  "status": "CONFIRMED",
  "restaurant": {
    "id": 1,
    "name": "Italian Bistro"
  },
  "reservation_date": "2023-12-15",
  "reservation_time": "19:00:00",
  "guest_count": 4
}
\`\`\`

## Promotions

### Apply Coupon
**POST** `/orders/{order_id}/apply-coupon/`

Request:
\`\`\`json
{
  "code": "SAVE20"
}
\`\`\`

Response:
\`\`\`json
{
  "discount": "4.56",
  "new_total": "18.22",
  "message": "Coupon applied successfully"
}
\`\`\`

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Invalid request",
  "details": {
    "email": ["This field is required"]
  }
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "detail": "Authentication credentials were not provided."
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "detail": "Not found."
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
\`\`\`

## Rate Limiting

- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour
- API key users: Custom limits

## Webhooks

### Available Events
- `order.created`
- `order.updated`
- `order.completed`
- `order.cancelled`
- `reservation.created`
- `reservation.confirmed`
- `payment.succeeded`
- `payment.failed`

### Webhook Payload
\`\`\`json
{
  "event": "order.created",
  "timestamp": "2023-12-01T18:30:00Z",
  "data": {
    "id": 1,
    "order_number": "ORD-20231201-001",
    ...
  }
}
\`\`\`

## Pagination

All list endpoints support pagination:

\`\`\`json
{
  "count": 100,
  "next": "http://api.example.com/restaurants/?page=2",
  "previous": null,
  "results": [...]
}
\`\`\`

## Filtering & Sorting

Use query parameters:
- `ordering=-created_at` - Sort by creation date (descending)
- `search=pizza` - Search across multiple fields
- `status=ACTIVE` - Filter by specific field
