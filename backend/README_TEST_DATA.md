# Comprehensive Test Data Generator

## Overview

This script generates comprehensive, realistic test data for the Restaurant Platform. It creates users, restaurants, menus, orders, reservations, and all other entities needed for testing and development.

## Usage

### Basic Usage

```bash
# Navigate to backend directory
cd backend

# Generate test data (without clearing existing data)
python create_comprehensive_test_data.py

# Clear existing data and generate fresh test data
python create_comprehensive_test_data.py --clear
```

### Options

- `--clear`: Clear all existing data before generating new test data

## Generated Data

The script creates the following test data:

### Users (14 total)
- **1 Admin**: `admin@restaurant.com` (password: `admin123`)
- **3 Restaurant Owners**: `owner1@restaurant.com`, `owner2@restaurant.com`, `owner3@restaurant.com` (password: `owner123`)
- **5 Customers**: `customer1@example.com` through `customer5@example.com` (password: `customer123`)
- **2 Support Agents**: `support1@restaurant.com`, `support2@restaurant.com` (password: `support123`)
- **1 Developer**: `developer@restaurant.com` (password: `developer123`)
- **2 Restaurant Staff**: `staff1@restaurant.com`, `staff2@restaurant.com` (password: `staff123`)

### Restaurants (10 total)
1. **Italiano Vero** - Italian cuisine in New York
2. **Tokyo Sushi Bar** - Japanese cuisine in Los Angeles
3. **Le Petit Bistro** - French cuisine in San Francisco
4. **Spice of India** - Indian cuisine in Chicago
5. **Dragon Wok** - Chinese cuisine in Boston
6. **Taco Fiesta** - Mexican cuisine in Austin
7. **American Grill House** - American cuisine in Seattle
8. **Mediterranean Delight** - Mediterranean cuisine in Miami
9. **Thai Paradise** - Thai cuisine in Denver
10. **Pasta Paradise** - Italian cuisine in Portland

### Menu Items
- **120+ items** across all restaurants
- **8 categories** per restaurant: Appetizers, Soups & Salads, Main Courses, Pasta & Noodles, Pizza, Desserts, Beverages, Specials
- Italiano Vero includes specific items like Margherita Pizza, Spaghetti Carbonara, Tiramisu, etc.

### Orders (10 total)
- 2 PENDING
- 2 CONFIRMED
- 2 PREPARING
- 1 OUT_FOR_DELIVERY
- 2 DELIVERED
- 1 CANCELLED

Each order includes:
- 2-5 menu items
- Properly calculated subtotal, tax (8%), delivery fee ($5 for delivery), and total
- Realistic delivery addresses (for delivery orders)

### Reservations (5 total)
- 2 CONFIRMED (future dates)
- 1 PENDING
- 1 COMPLETED (past date)
- 1 CANCELLED

### Tables (110 total)
Each restaurant has 11 tables:
- 4 tables for 2 people
- 4 tables for 4 people
- 2 tables for 6 people
- 1 table for 8 people

### Promotions (4 active codes)
- **WELCOME20**: 20% off first order (min $15)
- **SAVE10**: $10 off orders over $50
- **FREESHIP**: Free delivery on orders over $30
- **BOGO**: Buy one main course, get one 50% off

### Inventory Items
- **127 items** across all restaurants
- 10-15 items per restaurant
- Categories: Dairy, Sauces, Dry Goods, Oils, Herbs, Vegetables, Seasonings, Beverages

### Payments (10 total)
- Status based on order status:
  - COMPLETED for DELIVERED orders
  - FAILED for CANCELLED orders
  - PENDING for active orders

### Reviews (41 total)
- 3-5 reviews per restaurant
- Ratings from 3 to 5 stars
- Realistic review text using Faker

### Notifications (10 total)
- 5 order notifications for customers
- 3 new order notifications for restaurant owners
- 2 system notifications

### Support Tickets (3 total)
1. "Order not received" - OPEN - HIGH priority
2. "Wrong item delivered" - IN_PROGRESS - MEDIUM priority
3. "Account verification issue" - RESOLVED - LOW priority

### API Keys (3 total)
- 2 active production keys
- 1 inactive deprecated key

### Webhooks (2 total)
- Order events webhook
- Payment events webhook

### Analytics Reports (70 total)
- Daily sales reports for each restaurant
- Last 7 days of data
- Includes: total orders, revenue, customers, average order value

## Features

✅ **Colored Output**: Beautiful console output with emojis and colors  
✅ **Progress Tracking**: Clear progress indicators for each step  
✅ **Data Integrity**: Uses Django transactions for atomicity  
✅ **Realistic Data**: Uses Faker library for authentic-looking data  
✅ **Reproducibility**: Fixed seed for consistent data generation  
✅ **Unique Identifiers**: Properly generated order numbers, reservation numbers, etc.  
✅ **Proper Calculations**: Correct subtotals, taxes, and totals for orders  
✅ **Relationships**: All foreign key relationships properly established  

## Requirements

- Django and all dependencies must be installed
- Database must be migrated (`python manage.py migrate`)
- All models must be properly set up

## Example Output

```
============================================================
     🍽️  RESTAURANT PLATFORM - COMPREHENSIVE TEST DATA      
============================================================

📋 Creating users...
✓ Created Admin: admin@restaurant.com
✓ Created Restaurant Owner: owner1@restaurant.com
...

📊 DATA GENERATION SUMMARY
============================================================

✅ Users:
   • Total: 14
   • Admin: 1
   • Restaurant Owners: 3
   • Customers: 5
   • Support Agents: 2
   • Developer: 1
   • Restaurant Staff: 2

✅ Restaurants:
   • Total: 10

✅ Menu:
   • Categories: 80
   • Menu Items: 120

...

🎉 Test data generation completed successfully!
```

## Notes

- **First Run**: Use `--clear` flag to clear any existing data
- **Subsequent Runs**: Always use `--clear` flag to avoid unique constraint violations
- **Seed**: The script uses a fixed seed (42) for Faker, ensuring consistent data across runs
- **Performance**: Script completes in under 30 seconds typically

## Troubleshooting

### UNIQUE constraint failed

If you see this error, it means data already exists. Run the script with `--clear` flag:

```bash
python create_comprehensive_test_data.py --clear
```

### ModuleNotFoundError

Make sure all dependencies are installed:

```bash
pip install -r requirements.txt
```

### Database not ready

Run migrations first:

```bash
python manage.py migrate
```

## Development

The script is located at:
```
backend/create_comprehensive_test_data.py
```

To modify the data generated, edit the constants at the top of the script:
- `RESTAURANTS_DATA`: Restaurant information
- `MENU_CATEGORIES`: Menu category names
- `ITALIANO_MENU_ITEMS`: Sample menu items for Italian restaurant
- `PROMOTIONS_DATA`: Promotional codes
- `INVENTORY_ITEMS_TEMPLATE`: Inventory item templates
- `SUPPORT_TICKETS_DATA`: Support ticket templates

## License

Part of the Restaurant Platform project.
