# 🍽️ Enterprise Restaurant Management Platform

A comprehensive, enterprise-level restaurant management platform built with Django REST Framework and React.

## 🚀 Features

### For Customers
- Browse and search restaurants
- View menus with detailed information (allergens, dietary tags)
- Place orders for delivery or takeout
- Make table reservations
- Track order status in real-time
- Save favorite restaurants and addresses
- View order history

### For Restaurant Owners
- Dashboard with analytics and KPIs
- Menu management (categories, items, modifiers)
- Order fulfillment system
- Reservation management
- Inventory tracking with low-stock alerts
- Staff management
- Financial reports

### For Administrators
- System-wide dashboard
- Restaurant approval and management
- User management with role-based access
- Order monitoring across all restaurants
- Promotions and coupon management
- Support ticketing system
- Analytics and reporting

### For Developers
- API key management
- Webhook configuration
- API usage analytics
- Comprehensive API documentation

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.1 + Django REST Framework 3.16
- **Database**: PostgreSQL 16 (SQLite for development)
- **Caching**: Redis 7.1
- **Task Queue**: Celery 5.6
- **Authentication**: JWT (djangorestframework-simplejwt)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Forms**: Formik + Yup
- **Charts**: Chart.js
- **Notifications**: React-Toastify

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL
- **Cache & Message Broker**: Redis

## 📦 Quick Start with Docker

1. Clone the repository
2. Run: `docker-compose up -d`
3. Backend API: http://localhost:8000
4. Frontend: http://localhost:5173
5. Admin Panel: http://localhost:8000/admin

## 📁 Project Structure

- `backend/` - Django REST API with all modules
- `frontend/` - React application
- `docker-compose.yml` - Docker configuration

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting
- CORS configuration
- Input validation

## 📝 License

MIT License
