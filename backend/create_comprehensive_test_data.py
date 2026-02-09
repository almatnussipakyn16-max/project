#!/usr/bin/env python
"""
Comprehensive test data generator for Restaurant Platform
Usage: python create_comprehensive_test_data.py [--clear]
"""

import os
import sys
import django
from decimal import Decimal
from datetime import datetime, timedelta
import random
import argparse

# Django setup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction
from faker import Faker

# Import all models
from restaurants.models import Restaurant, RestaurantImage, Review
from menu.models import MenuCategory, MenuItem
from orders.models import Order, OrderItem
from reservations.models import Table, Reservation
from payments.models import Payment
from promotions.models import Promotion
from inventory.models import InventoryItem
from notifications.models import Notification
from support.models import Ticket
from developers.models import APIKey, Webhook
from analytics.models import DailySalesReport

User = get_user_model()
fake = Faker()
Faker.seed(42)  # For reproducibility
random.seed(42)

# Color codes
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_success(msg):
    print(f"{Colors.OKGREEN}✓ {msg}{Colors.ENDC}")

def print_info(msg):
    print(f"{Colors.OKCYAN}ℹ {msg}{Colors.ENDC}")

def print_warning(msg):
    print(f"{Colors.WARNING}⚠ {msg}{Colors.ENDC}")

def print_error(msg):
    print(f"{Colors.FAIL}✗ {msg}{Colors.ENDC}")

def print_header(msg):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{msg.center(60)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_section(msg):
    print(f"\n{Colors.OKBLUE}{Colors.BOLD}📋 {msg}{Colors.ENDC}")

# Restaurant data
RESTAURANTS_DATA = [
    {
        'name': 'Italiano Vero',
        'cuisine_type': 'ITALIAN',
        'description': 'Authentic Italian cuisine with fresh pasta and pizza',
        'city': 'New York',
        'address': '123 Broadway, Manhattan',
        'phone': '+1-212-555-0101',
        'email': 'info@italiaovero.com',
        'opening_time': '11:00',
        'closing_time': '23:00',
        'rating': 4.8,
    },
    {
        'name': 'Tokyo Sushi Bar',
        'cuisine_type': 'JAPANESE',
        'description': 'Fresh sushi and traditional Japanese dishes',
        'city': 'Los Angeles',
        'address': '456 Sunset Blvd',
        'phone': '+1-310-555-0202',
        'email': 'info@tokyosushi.com',
        'opening_time': '12:00',
        'closing_time': '22:00',
        'rating': 4.9,
    },
    {
        'name': 'Le Petit Bistro',
        'cuisine_type': 'FRENCH',
        'description': 'Classic French cuisine in a cozy atmosphere',
        'city': 'San Francisco',
        'address': '789 Market St',
        'phone': '+1-415-555-0303',
        'email': 'info@lepetitbistro.com',
        'opening_time': '10:00',
        'closing_time': '22:30',
        'rating': 4.7,
    },
    {
        'name': 'Spice of India',
        'cuisine_type': 'INDIAN',
        'description': 'Aromatic Indian dishes with authentic spices',
        'city': 'Chicago',
        'address': '321 Michigan Ave',
        'phone': '+1-312-555-0404',
        'email': 'info@spiceofindia.com',
        'opening_time': '11:30',
        'closing_time': '23:00',
        'rating': 4.6,
    },
    {
        'name': 'Dragon Wok',
        'cuisine_type': 'CHINESE',
        'description': 'Traditional Chinese cuisine and dim sum',
        'city': 'Boston',
        'address': '654 Chinatown St',
        'phone': '+1-617-555-0505',
        'email': 'info@dragonwok.com',
        'opening_time': '11:00',
        'closing_time': '22:00',
        'rating': 4.5,
    },
    {
        'name': 'Taco Fiesta',
        'cuisine_type': 'MEXICAN',
        'description': 'Authentic Mexican street food and tacos',
        'city': 'Austin',
        'address': '987 6th Street',
        'phone': '+1-512-555-0606',
        'email': 'info@tacofiesta.com',
        'opening_time': '10:00',
        'closing_time': '23:30',
        'rating': 4.4,
    },
    {
        'name': 'American Grill House',
        'cuisine_type': 'AMERICAN',
        'description': 'Classic American burgers, steaks and BBQ',
        'city': 'Seattle',
        'address': '147 Pike Place',
        'phone': '+1-206-555-0707',
        'email': 'info@americangrill.com',
        'opening_time': '11:00',
        'closing_time': '23:00',
        'rating': 4.3,
    },
    {
        'name': 'Mediterranean Delight',
        'cuisine_type': 'OTHER',
        'description': 'Fresh Mediterranean and Greek cuisine',
        'city': 'Miami',
        'address': '258 Ocean Drive',
        'phone': '+1-305-555-0808',
        'email': 'info@meddelight.com',
        'opening_time': '12:00',
        'closing_time': '22:00',
        'rating': 4.7,
    },
    {
        'name': 'Thai Paradise',
        'cuisine_type': 'OTHER',
        'description': 'Authentic Thai curries and noodles',
        'city': 'Denver',
        'address': '369 Colfax Ave',
        'phone': '+1-303-555-0909',
        'email': 'info@thaiparadise.com',
        'opening_time': '11:30',
        'closing_time': '22:30',
        'rating': 4.8,
    },
    {
        'name': 'Pasta Paradise',
        'cuisine_type': 'ITALIAN',
        'description': 'Homemade pasta and Italian comfort food',
        'city': 'Portland',
        'address': '741 Broadway',
        'phone': '+1-503-555-1010',
        'email': 'info@pastaparadise.com',
        'opening_time': '11:00',
        'closing_time': '22:00',
        'rating': 4.6,
    },
]

# Menu categories
MENU_CATEGORIES = [
    'Appetizers',
    'Soups & Salads',
    'Main Courses',
    'Pasta & Noodles',
    'Pizza',
    'Desserts',
    'Beverages',
    'Specials',
]

# Menu items for Italiano Vero (can be used as template)
ITALIANO_MENU_ITEMS = [
    {
        'name': 'Margherita Pizza',
        'category': 'Pizza',
        'price': 14.99,
        'description': 'Classic pizza with tomato sauce, mozzarella and basil',
        'is_vegetarian': True,
        'preparation_time': 20,
    },
    {
        'name': 'Spaghetti Carbonara',
        'category': 'Pasta & Noodles',
        'price': 16.99,
        'description': 'Pasta with eggs, bacon, and parmesan cheese',
        'preparation_time': 15,
    },
    {
        'name': 'Bruschetta',
        'category': 'Appetizers',
        'price': 8.99,
        'description': 'Grilled bread with tomatoes, garlic and olive oil',
        'is_vegetarian': True,
        'is_vegan': True,
        'preparation_time': 10,
    },
    {
        'name': 'Tiramisu',
        'category': 'Desserts',
        'price': 7.99,
        'description': 'Classic Italian dessert with coffee and mascarpone',
        'is_vegetarian': True,
        'preparation_time': 5,
    },
    {
        'name': 'Caprese Salad',
        'category': 'Soups & Salads',
        'price': 11.99,
        'description': 'Fresh mozzarella, tomatoes and basil',
        'is_vegetarian': True,
        'is_gluten_free': True,
        'preparation_time': 10,
    },
    {
        'name': 'Lasagna Bolognese',
        'category': 'Main Courses',
        'price': 18.99,
        'description': 'Layered pasta with meat sauce and bechamel',
        'preparation_time': 25,
    },
    {
        'name': 'Risotto ai Funghi',
        'category': 'Main Courses',
        'price': 17.99,
        'description': 'Creamy mushroom risotto',
        'is_vegetarian': True,
        'is_gluten_free': True,
        'preparation_time': 20,
    },
    {
        'name': 'Panna Cotta',
        'category': 'Desserts',
        'price': 6.99,
        'description': 'Italian cream dessert with berry sauce',
        'is_vegetarian': True,
        'is_gluten_free': True,
        'preparation_time': 5,
    },
    {
        'name': 'Prosciutto e Melone',
        'category': 'Appetizers',
        'price': 12.99,
        'description': 'Cured ham with fresh melon',
        'is_gluten_free': True,
        'preparation_time': 8,
    },
    {
        'name': 'Osso Buco',
        'category': 'Main Courses',
        'price': 24.99,
        'description': 'Braised veal shanks in rich tomato sauce',
        'preparation_time': 30,
    },
]

# Promotion codes
PROMOTIONS_DATA = [
    {
        'code': 'WELCOME20',
        'name': 'Welcome Discount',
        'description': '20% off your first order',
        'discount_type': 'PERCENTAGE',
        'discount_value': 20.00,
        'min_order_amount': 15.00,
        'max_uses': 100,
    },
    {
        'code': 'SAVE10',
        'name': 'Save $10',
        'description': '$10 off orders over $50',
        'discount_type': 'FIXED',
        'discount_value': 10.00,
        'min_order_amount': 50.00,
        'max_uses': 50,
    },
    {
        'code': 'FREESHIP',
        'name': 'Free Delivery',
        'description': 'Free delivery on orders over $30',
        'discount_type': 'FIXED',
        'discount_value': 5.00,
        'min_order_amount': 30.00,
        'max_uses': None,
    },
    {
        'code': 'BOGO',
        'name': 'Buy One Get One',
        'description': 'Buy one main course, get one 50% off',
        'discount_type': 'PERCENTAGE',
        'discount_value': 50.00,
        'min_order_amount': 0.00,
        'max_uses': 20,
    },
]

# Inventory items template
INVENTORY_ITEMS_TEMPLATE = [
    {'name': 'Mozzarella Cheese', 'sku': 'MOZZ-001', 'quantity': 25.5, 'unit': 'KG', 'min_quantity': 10.0, 'price_per_unit': 12.50, 'category': 'Dairy'},
    {'name': 'Tomato Sauce', 'sku': 'TOM-001', 'quantity': 30.0, 'unit': 'L', 'min_quantity': 15.0, 'price_per_unit': 5.00, 'category': 'Sauces'},
    {'name': 'Pasta (Spaghetti)', 'sku': 'PASTA-001', 'quantity': 50.0, 'unit': 'KG', 'min_quantity': 20.0, 'price_per_unit': 3.50, 'category': 'Dry Goods'},
    {'name': 'Olive Oil', 'sku': 'OIL-001', 'quantity': 20.0, 'unit': 'L', 'min_quantity': 10.0, 'price_per_unit': 15.00, 'category': 'Oils'},
    {'name': 'Fresh Basil', 'sku': 'BASIL-001', 'quantity': 2.5, 'unit': 'KG', 'min_quantity': 1.0, 'price_per_unit': 25.00, 'category': 'Herbs'},
    {'name': 'Parmesan Cheese', 'sku': 'PARM-001', 'quantity': 15.0, 'unit': 'KG', 'min_quantity': 5.0, 'price_per_unit': 18.00, 'category': 'Dairy'},
    {'name': 'Fresh Tomatoes', 'sku': 'FTOM-001', 'quantity': 40.0, 'unit': 'KG', 'min_quantity': 20.0, 'price_per_unit': 4.00, 'category': 'Vegetables'},
    {'name': 'Garlic', 'sku': 'GAR-001', 'quantity': 8.0, 'unit': 'KG', 'min_quantity': 3.0, 'price_per_unit': 6.00, 'category': 'Vegetables'},
    {'name': 'Eggs', 'sku': 'EGG-001', 'quantity': 120.0, 'unit': 'PCS', 'min_quantity': 60.0, 'price_per_unit': 0.30, 'category': 'Dairy'},
    {'name': 'Flour', 'sku': 'FLOUR-001', 'quantity': 100.0, 'unit': 'KG', 'min_quantity': 40.0, 'price_per_unit': 2.00, 'category': 'Dry Goods'},
    {'name': 'Butter', 'sku': 'BUT-001', 'quantity': 12.0, 'unit': 'KG', 'min_quantity': 5.0, 'price_per_unit': 8.00, 'category': 'Dairy'},
    {'name': 'Salt', 'sku': 'SALT-001', 'quantity': 25.0, 'unit': 'KG', 'min_quantity': 10.0, 'price_per_unit': 1.50, 'category': 'Seasonings'},
    {'name': 'Black Pepper', 'sku': 'PEPP-001', 'quantity': 5.0, 'unit': 'KG', 'min_quantity': 2.0, 'price_per_unit': 12.00, 'category': 'Seasonings'},
    {'name': 'Heavy Cream', 'sku': 'CREAM-001', 'quantity': 18.0, 'unit': 'L', 'min_quantity': 8.0, 'price_per_unit': 7.00, 'category': 'Dairy'},
    {'name': 'White Wine', 'sku': 'WINE-001', 'quantity': 15.0, 'unit': 'L', 'min_quantity': 6.0, 'price_per_unit': 10.00, 'category': 'Beverages'},
]

# Support tickets
SUPPORT_TICKETS_DATA = [
    {
        'subject': 'Order not received',
        'description': 'I placed an order 2 hours ago but haven't received it yet.',
        'status': 'OPEN',
        'priority': 'HIGH',
    },
    {
        'subject': 'Wrong item delivered',
        'description': 'I ordered pizza but received pasta instead.',
        'status': 'IN_PROGRESS',
        'priority': 'MEDIUM',
    },
    {
        'subject': 'Account verification issue',
        'description': 'I cannot verify my email address.',
        'status': 'RESOLVED',
        'priority': 'LOW',
    },
]

def generate_order_number():
    """Generate unique order number."""
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    random_suffix = random.randint(1000, 9999)
    return f'ORD-{timestamp}-{random_suffix}'

def generate_reservation_number():
    """Generate unique reservation number."""
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    random_suffix = random.randint(1000, 9999)
    return f'RES-{timestamp}-{random_suffix}'

def generate_ticket_number():
    """Generate unique ticket number."""
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    random_suffix = random.randint(1000, 9999)
    return f'TKT-{timestamp}-{random_suffix}'

def clear_existing_data():
    """Clear all existing test data."""
    print_section("Clearing existing data...")
    
    models_to_clear = [
        DailySalesReport,
        Webhook,
        APIKey,
        Ticket,
        Notification,
        Payment,
        Review,
        OrderItem,
        Order,
        Reservation,
        Table,
        InventoryItem,
        Promotion,
        MenuItem,
        MenuCategory,
        RestaurantImage,
        Restaurant,
        User,
    ]
    
    for model in models_to_clear:
        count = model.objects.all().count()
        model.objects.all().delete()
        print_success(f"Deleted {count} {model.__name__} records")

def create_users():
    """Create test users with different roles."""
    print_section("Creating users...")
    
    users = {}
    
    # 1 Admin
    admin = User.objects.create_user(
        email='admin@restaurant.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        role=User.Role.ADMIN,
        is_staff=True,
        is_superuser=True,
        is_active=True,
        is_email_verified=True,
    )
    users['admin'] = admin
    print_success(f"Created Admin: {admin.email}")
    
    # 3 Restaurant Owners
    owners = []
    for i in range(3):
        owner = User.objects.create_user(
            email=f'owner{i+1}@restaurant.com',
            password='owner123',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            role=User.Role.RESTAURANT_OWNER,
            phone=fake.phone_number()[:20],
            is_active=True,
            is_email_verified=True,
        )
        owners.append(owner)
        print_success(f"Created Restaurant Owner: {owner.email}")
    users['owners'] = owners
    
    # 5 Customers
    customers = []
    for i in range(5):
        customer = User.objects.create_user(
            email=f'customer{i+1}@example.com',
            password='customer123',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            role=User.Role.CUSTOMER,
            phone=fake.phone_number()[:20],
            is_active=True,
            is_email_verified=True,
        )
        customers.append(customer)
        print_success(f"Created Customer: {customer.email}")
    users['customers'] = customers
    
    # 2 Support agents (using STAFF role)
    support_agents = []
    for i in range(2):
        agent = User.objects.create_user(
            email=f'support{i+1}@restaurant.com',
            password='support123',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            role=User.Role.STAFF,
            is_staff=True,
            is_active=True,
            is_email_verified=True,
        )
        support_agents.append(agent)
        print_success(f"Created Support Agent: {agent.email}")
    users['support'] = support_agents
    
    # 1 Developer
    developer = User.objects.create_user(
        email='developer@restaurant.com',
        password='developer123',
        first_name='Dev',
        last_name='User',
        role=User.Role.DEVELOPER,
        is_active=True,
        is_email_verified=True,
    )
    users['developer'] = developer
    print_success(f"Created Developer: {developer.email}")
    
    # 2 Restaurant Staff
    staff = []
    for i in range(2):
        staff_member = User.objects.create_user(
            email=f'staff{i+1}@restaurant.com',
            password='staff123',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            role=User.Role.STAFF,
            is_active=True,
            is_email_verified=True,
        )
        staff.append(staff_member)
        print_success(f"Created Restaurant Staff: {staff_member.email}")
    users['staff'] = staff
    
    print_info(f"Total users created: {User.objects.count()}")
    return users

def create_restaurants(owners):
    """Create test restaurants."""
    print_section("Creating restaurants...")
    
    restaurants = []
    
    for i, restaurant_data in enumerate(RESTAURANTS_DATA):
        # Cycle through owners
        owner = owners[i % len(owners)]
        
        restaurant = Restaurant.objects.create(
            owner=owner,
            name=restaurant_data['name'],
            slug=restaurant_data['name'].lower().replace(' ', '-'),
            description=restaurant_data['description'],
            email=restaurant_data['email'],
            phone=restaurant_data['phone'],
            address_line1=restaurant_data['address'],
            city=restaurant_data['city'],
            state='State',
            postal_code=fake.postcode(),
            country='USA',
            cuisine_types=[restaurant_data['cuisine_type']],
            status=Restaurant.Status.ACTIVE,
            rating=Decimal(str(restaurant_data['rating'])),
            delivery_available=True,
            takeout_available=True,
            reservation_available=True,
        )
        restaurants.append(restaurant)
        print_success(f"Created Restaurant: {restaurant.name}")
    
    print_info(f"Total restaurants created: {len(restaurants)}")
    return restaurants

def create_menu_items(restaurants):
    """Create menu items for restaurants."""
    print_section("Creating menu items...")
    
    total_items = 0
    
    for restaurant in restaurants:
        # Create categories for this restaurant
        categories = {}
        for cat_name in MENU_CATEGORIES:
            category = MenuCategory.objects.create(
                restaurant=restaurant,
                name=cat_name,
                description=f'{cat_name} at {restaurant.name}',
                order=MENU_CATEGORIES.index(cat_name),
                is_active=True,
            )
            categories[cat_name] = category
        
        # Create menu items
        # For Italiano Vero, use predefined items
        if 'Italiano' in restaurant.name:
            for item_data in ITALIANO_MENU_ITEMS:
                dietary_tags = []
                if item_data.get('is_vegetarian'):
                    dietary_tags.append('vegetarian')
                if item_data.get('is_vegan'):
                    dietary_tags.append('vegan')
                if item_data.get('is_gluten_free'):
                    dietary_tags.append('gluten-free')
                
                MenuItem.objects.create(
                    category=categories[item_data['category']],
                    name=item_data['name'],
                    description=item_data['description'],
                    price=Decimal(str(item_data['price'])),
                    preparation_time=item_data['preparation_time'],
                    dietary_tags=dietary_tags,
                    is_available=True,
                    is_featured=random.choice([True, False]),
                )
                total_items += 1
        else:
            # Generate random items for other restaurants
            for _ in range(random.randint(10, 15)):
                category = random.choice(list(categories.values()))
                price = Decimal(str(round(random.uniform(5.99, 29.99), 2)))
                
                MenuItem.objects.create(
                    category=category,
                    name=fake.catch_phrase()[:50],
                    description=fake.text(max_nb_chars=200),
                    price=price,
                    preparation_time=random.randint(10, 35),
                    dietary_tags=random.sample(['vegetarian', 'vegan', 'gluten-free', 'spicy', 'dairy-free'], random.randint(0, 2)),
                    is_available=True,
                    is_featured=random.choice([True, False, False]),
                )
                total_items += 1
        
        print_success(f"Created menu items for {restaurant.name}")
    
    print_info(f"Total menu items created: {total_items}")
    return total_items

def create_tables(restaurants):
    """Create tables for restaurants."""
    print_section("Creating tables...")
    
    total_tables = 0
    
    for restaurant in restaurants:
        table_number = 1
        
        # 4 tables for 2 people
        for _ in range(4):
            Table.objects.create(
                restaurant=restaurant,
                table_number=f'T{table_number:02d}',
                capacity=2,
                is_available=True,
            )
            table_number += 1
            total_tables += 1
        
        # 4 tables for 4 people
        for _ in range(4):
            Table.objects.create(
                restaurant=restaurant,
                table_number=f'T{table_number:02d}',
                capacity=4,
                is_available=True,
            )
            table_number += 1
            total_tables += 1
        
        # 2 tables for 6 people
        for _ in range(2):
            Table.objects.create(
                restaurant=restaurant,
                table_number=f'T{table_number:02d}',
                capacity=6,
                is_available=True,
            )
            table_number += 1
            total_tables += 1
        
        # 1 table for 8 people
        Table.objects.create(
            restaurant=restaurant,
            table_number=f'T{table_number:02d}',
            capacity=8,
            is_available=True,
        )
        total_tables += 1
        
        print_success(f"Created tables for {restaurant.name}")
    
    print_info(f"Total tables created: {total_tables}")
    return total_tables

def create_orders(customers, restaurants):
    """Create test orders."""
    print_section("Creating orders...")
    
    orders = []
    order_statuses = [
        (Order.Status.PENDING, 2),
        (Order.Status.CONFIRMED, 2),
        (Order.Status.PREPARING, 2),
        (Order.Status.OUT_FOR_DELIVERY, 1),
        (Order.Status.DELIVERED, 2),
        (Order.Status.CANCELLED, 1),
    ]
    
    for status, count in order_statuses:
        for _ in range(count):
            customer = random.choice(customers)
            restaurant = random.choice(restaurants)
            
            # Get menu items from this restaurant
            menu_items = list(MenuItem.objects.filter(category__restaurant=restaurant))
            if not menu_items:
                continue
            
            # Select 2-5 items
            selected_items = random.sample(menu_items, min(random.randint(2, 5), len(menu_items)))
            
            # Calculate totals
            subtotal = Decimal('0.00')
            order_items_data = []
            
            for item in selected_items:
                quantity = random.randint(1, 3)
                item_subtotal = item.price * quantity
                subtotal += item_subtotal
                order_items_data.append({
                    'item': item,
                    'quantity': quantity,
                    'unit_price': item.price,
                    'subtotal': item_subtotal,
                })
            
            # Tax (8%)
            tax = subtotal * Decimal('0.08')
            
            # Delivery fee
            order_type = random.choice([Order.OrderType.DELIVERY, Order.OrderType.TAKEOUT])
            delivery_fee = Decimal('5.00') if order_type == Order.OrderType.DELIVERY else Decimal('0.00')
            
            # Total
            total = subtotal + tax + delivery_fee
            
            # Create order
            order = Order.objects.create(
                user=customer,
                restaurant=restaurant,
                order_number=generate_order_number(),
                order_type=order_type,
                status=status,
                subtotal=subtotal.quantize(Decimal('0.01')),
                tax=tax.quantize(Decimal('0.01')),
                delivery_fee=delivery_fee,
                total=total.quantize(Decimal('0.01')),
                delivery_address={
                    'address': fake.street_address(),
                    'city': fake.city(),
                    'state': fake.state_abbr(),
                    'postal_code': fake.postcode(),
                } if order_type == Order.OrderType.DELIVERY else None,
                delivery_instructions=fake.sentence() if order_type == Order.OrderType.DELIVERY else '',
                created_at=timezone.now() - timedelta(days=random.randint(0, 7)),
            )
            
            # Create order items
            for item_data in order_items_data:
                OrderItem.objects.create(
                    order=order,
                    menu_item=item_data['item'],
                    quantity=item_data['quantity'],
                    unit_price=item_data['unit_price'],
                    subtotal=item_data['subtotal'].quantize(Decimal('0.01')),
                )
            
            orders.append(order)
            print_success(f"Created Order: {order.order_number} ({status})")
    
    print_info(f"Total orders created: {len(orders)}")
    return orders

def create_reservations(customers, restaurants):
    """Create test reservations."""
    print_section("Creating reservations...")
    
    reservations = []
    reservation_statuses = [
        (Reservation.Status.CONFIRMED, 2),
        (Reservation.Status.PENDING, 1),
        (Reservation.Status.COMPLETED, 1),
        (Reservation.Status.CANCELLED, 1),
    ]
    
    for status, count in reservation_statuses:
        for _ in range(count):
            customer = random.choice(customers)
            restaurant = random.choice(restaurants)
            
            # Get available tables
            tables = list(Table.objects.filter(restaurant=restaurant))
            if not tables:
                continue
            
            table = random.choice(tables)
            
            # Date and time
            if status == Reservation.Status.CONFIRMED:
                # Future date
                reservation_date = timezone.now().date() + timedelta(days=random.randint(1, 14))
            elif status == Reservation.Status.COMPLETED:
                # Past date
                reservation_date = timezone.now().date() - timedelta(days=random.randint(1, 7))
            else:
                reservation_date = timezone.now().date() + timedelta(days=random.randint(0, 7))
            
            reservation_time = datetime.strptime(f'{random.randint(11, 20)}:00', '%H:%M').time()
            
            reservation = Reservation.objects.create(
                user=customer,
                restaurant=restaurant,
                table=table,
                reservation_number=generate_reservation_number(),
                guest_count=random.randint(1, table.capacity),
                reservation_date=reservation_date,
                reservation_time=reservation_time,
                status=status,
                special_requests=fake.sentence() if random.choice([True, False]) else '',
            )
            
            reservations.append(reservation)
            print_success(f"Created Reservation: {reservation.reservation_number} ({status})")
    
    print_info(f"Total reservations created: {len(reservations)}")
    return reservations

def create_promotions(restaurants):
    """Create promotional codes."""
    print_section("Creating promotions...")
    
    promotions = []
    
    for promo_data in PROMOTIONS_DATA:
        # Some promotions are global (no restaurant), others are restaurant-specific
        restaurant = random.choice([None, random.choice(restaurants)])
        
        promotion = Promotion.objects.create(
            restaurant=restaurant,
            code=promo_data['code'],
            name=promo_data['name'],
            description=promo_data['description'],
            discount_type=promo_data['discount_type'],
            discount_value=Decimal(str(promo_data['discount_value'])),
            start_date=timezone.now() - timedelta(days=7),
            end_date=timezone.now() + timedelta(days=30),
            max_uses=promo_data['max_uses'],
            current_uses=random.randint(0, 10),
            minimum_order_amount=Decimal(str(promo_data['min_order_amount'])),
            is_active=True,
        )
        
        promotions.append(promotion)
        print_success(f"Created Promotion: {promotion.code}")
    
    print_info(f"Total promotions created: {len(promotions)}")
    return promotions

def create_inventory(restaurants):
    """Create inventory items."""
    print_section("Creating inventory items...")
    
    total_items = 0
    
    for restaurant in restaurants:
        # Create 10-15 inventory items per restaurant
        num_items = random.randint(10, 15)
        items_to_create = random.sample(INVENTORY_ITEMS_TEMPLATE, min(num_items, len(INVENTORY_ITEMS_TEMPLATE)))
        
        for item_data in items_to_create:
            InventoryItem.objects.create(
                restaurant=restaurant,
                name=item_data['name'],
                sku=f"{restaurant.id}-{item_data['sku']}",
                category=item_data['category'],
                current_quantity=Decimal(str(item_data['quantity'])),
                unit=item_data['unit'],
                minimum_quantity=Decimal(str(item_data['min_quantity'])),
                unit_cost=Decimal(str(item_data['price_per_unit'])),
                last_restocked=timezone.now() - timedelta(days=random.randint(0, 14)),
            )
            total_items += 1
        
        print_success(f"Created inventory items for {restaurant.name}")
    
    print_info(f"Total inventory items created: {total_items}")
    return total_items

def create_payments(orders):
    """Create payment records."""
    print_section("Creating payments...")
    
    payments = []
    
    for order in orders:
        # Create payment based on order status
        if order.status == Order.Status.DELIVERED:
            payment_status = Payment.Status.COMPLETED
        elif order.status == Order.Status.CANCELLED:
            payment_status = Payment.Status.FAILED
        else:
            payment_status = Payment.Status.PENDING
        
        payment = Payment.objects.create(
            user=order.user,
            order=order,
            transaction_id=f'TXN-{order.order_number}',
            amount=order.total,
            method=random.choice([Payment.Method.CARD, Payment.Method.STRIPE, Payment.Method.CASH]),
            status=payment_status,
            gateway_response={'status': payment_status, 'timestamp': str(timezone.now())},
        )
        
        payments.append(payment)
        print_success(f"Created Payment for Order: {order.order_number}")
    
    print_info(f"Total payments created: {len(payments)}")
    return payments

def create_reviews(customers, restaurants):
    """Create restaurant reviews."""
    print_section("Creating reviews...")
    
    reviews = []
    
    for restaurant in restaurants:
        # Create 3-5 reviews per restaurant
        num_reviews = random.randint(3, 5)
        review_customers = random.sample(customers, min(num_reviews, len(customers)))
        
        for customer in review_customers:
            rating = random.randint(3, 5)
            
            review = Review.objects.create(
                restaurant=restaurant,
                user=customer,
                rating=rating,
                title=fake.sentence(nb_words=5)[:100],
                comment=fake.paragraph(nb_sentences=3),
                is_approved=True,
                is_flagged=False,
                created_at=timezone.now() - timedelta(days=random.randint(0, 30)),
            )
            
            reviews.append(review)
        
        print_success(f"Created reviews for {restaurant.name}")
    
    print_info(f"Total reviews created: {len(reviews)}")
    return reviews

def create_notifications(users_dict):
    """Create notifications."""
    print_section("Creating notifications...")
    
    notifications = []
    customers = users_dict['customers']
    owners = users_dict['owners']
    
    # 5 notifications for customers about orders
    for _ in range(5):
        customer = random.choice(customers)
        notification = Notification.objects.create(
            user=customer,
            type=Notification.Type.ORDER,
            title='Order Update',
            message=random.choice([
                'Your order has been confirmed',
                'Your order is being prepared',
                'Your order is out for delivery',
                'Your order has been delivered',
            ]),
            data={'order_id': random.randint(1, 100)},
            is_read=random.choice([True, False]),
            created_at=timezone.now() - timedelta(hours=random.randint(0, 48)),
        )
        notifications.append(notification)
    
    # 3 notifications for owners about new orders
    for _ in range(3):
        owner = random.choice(owners)
        notification = Notification.objects.create(
            user=owner,
            type=Notification.Type.ORDER,
            title='New Order Received',
            message=f'You have received a new order worth ${random.randint(20, 100)}.00',
            data={'order_id': random.randint(1, 100)},
            is_read=random.choice([True, False]),
            created_at=timezone.now() - timedelta(hours=random.randint(0, 24)),
        )
        notifications.append(notification)
    
    # 2 system notifications
    all_users = customers + owners
    for _ in range(2):
        user = random.choice(all_users)
        notification = Notification.objects.create(
            user=user,
            type=Notification.Type.SYSTEM,
            title='System Update',
            message=random.choice([
                'Our platform has been updated with new features',
                'Scheduled maintenance on Sunday 2AM-4AM',
            ]),
            is_read=random.choice([True, False]),
            created_at=timezone.now() - timedelta(days=random.randint(0, 7)),
        )
        notifications.append(notification)
    
    print_success(f"Created {len(notifications)} notifications")
    print_info(f"Total notifications created: {len(notifications)}")
    return notifications

def create_support_tickets(users_dict):
    """Create support tickets."""
    print_section("Creating support tickets...")
    
    tickets = []
    customers = users_dict['customers']
    support_agents = users_dict['support']
    
    for ticket_data in SUPPORT_TICKETS_DATA:
        customer = random.choice(customers)
        assigned_to = random.choice(support_agents) if ticket_data['status'] != 'OPEN' else None
        
        ticket = Ticket.objects.create(
            user=customer,
            ticket_number=generate_ticket_number(),
            subject=ticket_data['subject'],
            description=ticket_data['description'],
            status=ticket_data['status'],
            priority=ticket_data['priority'],
            assigned_to=assigned_to,
            created_at=timezone.now() - timedelta(days=random.randint(0, 7)),
        )
        
        tickets.append(ticket)
        print_success(f"Created Ticket: {ticket.ticket_number}")
    
    print_info(f"Total tickets created: {len(tickets)}")
    return tickets

def create_api_keys(developer):
    """Create API keys."""
    print_section("Creating API keys...")
    
    api_keys = []
    
    # 2 active API keys
    for i in range(2):
        api_key = APIKey.objects.create(
            user=developer,
            name=f'Production API Key {i+1}',
            is_active=True,
            rate_limit=random.choice([1000, 5000, 10000]),
        )
        api_keys.append(api_key)
        print_success(f"Created API Key: {api_key.name}")
    
    # 1 inactive API key
    api_key = APIKey.objects.create(
        user=developer,
        name='Deprecated API Key',
        is_active=False,
        rate_limit=1000,
        last_used=timezone.now() - timedelta(days=30),
    )
    api_keys.append(api_key)
    print_success(f"Created API Key: {api_key.name} (inactive)")
    
    print_info(f"Total API keys created: {len(api_keys)}")
    return api_keys

def create_webhooks(developer):
    """Create webhooks."""
    print_section("Creating webhooks...")
    
    webhooks = []
    
    webhook_data = [
        {
            'url': 'https://example.com/webhooks/orders',
            'events': ['order.created', 'order.updated', 'order.completed'],
            'is_active': True,
        },
        {
            'url': 'https://api.example.com/notifications',
            'events': ['payment.succeeded', 'payment.failed'],
            'is_active': True,
        },
    ]
    
    for data in webhook_data:
        webhook = Webhook.objects.create(
            user=developer,
            url=data['url'],
            events=data['events'],
            is_active=data['is_active'],
        )
        webhooks.append(webhook)
        print_success(f"Created Webhook: {webhook.url}")
    
    print_info(f"Total webhooks created: {len(webhooks)}")
    return webhooks

def create_analytics(restaurants):
    """Create analytics reports."""
    print_section("Creating analytics reports...")
    
    reports = []
    
    # Create reports for last 7 days for each restaurant
    for restaurant in restaurants:
        for days_ago in range(7):
            report_date = timezone.now().date() - timedelta(days=days_ago)
            
            total_orders = random.randint(5, 30)
            total_revenue = Decimal(str(round(random.uniform(200, 1500), 2)))
            total_customers = random.randint(5, total_orders)
            average_order_value = (total_revenue / total_orders).quantize(Decimal('0.01')) if total_orders > 0 else Decimal('0.00')
            
            report = DailySalesReport.objects.create(
                restaurant=restaurant,
                date=report_date,
                total_orders=total_orders,
                total_revenue=total_revenue,
                total_customers=total_customers,
                average_order_value=average_order_value,
            )
            reports.append(report)
        
        print_success(f"Created analytics reports for {restaurant.name}")
    
    print_info(f"Total analytics reports created: {len(reports)}")
    return reports

def print_summary(users, restaurants, menu_items_count, tables_count, orders, reservations, promotions, inventory_count, payments, reviews, notifications, tickets, api_keys, webhooks, analytics):
    """Print summary of created data."""
    print_header("📊 DATA GENERATION SUMMARY")
    
    print(f"{Colors.OKGREEN}✅ Users:{Colors.ENDC}")
    print(f"   • Total: {User.objects.count()}")
    print(f"   • Admin: 1")
    print(f"   • Restaurant Owners: {len(users['owners'])}")
    print(f"   • Customers: {len(users['customers'])}")
    print(f"   • Support Agents: {len(users['support'])}")
    print(f"   • Developer: 1")
    print(f"   • Restaurant Staff: {len(users['staff'])}")
    
    print(f"\n{Colors.OKGREEN}✅ Restaurants:{Colors.ENDC}")
    print(f"   • Total: {len(restaurants)}")
    
    print(f"\n{Colors.OKGREEN}✅ Menu:{Colors.ENDC}")
    print(f"   • Categories: {MenuCategory.objects.count()}")
    print(f"   • Menu Items: {menu_items_count}")
    
    print(f"\n{Colors.OKGREEN}✅ Orders:{Colors.ENDC}")
    print(f"   • Total: {len(orders)}")
    print(f"   • PENDING: {Order.objects.filter(status=Order.Status.PENDING).count()}")
    print(f"   • CONFIRMED: {Order.objects.filter(status=Order.Status.CONFIRMED).count()}")
    print(f"   • PREPARING: {Order.objects.filter(status=Order.Status.PREPARING).count()}")
    print(f"   • OUT_FOR_DELIVERY: {Order.objects.filter(status=Order.Status.OUT_FOR_DELIVERY).count()}")
    print(f"   • DELIVERED: {Order.objects.filter(status=Order.Status.DELIVERED).count()}")
    print(f"   • CANCELLED: {Order.objects.filter(status=Order.Status.CANCELLED).count()}")
    
    print(f"\n{Colors.OKGREEN}✅ Tables:{Colors.ENDC}")
    print(f"   • Total: {tables_count}")
    
    print(f"\n{Colors.OKGREEN}✅ Reservations:{Colors.ENDC}")
    print(f"   • Total: {len(reservations)}")
    print(f"   • CONFIRMED: {Reservation.objects.filter(status=Reservation.Status.CONFIRMED).count()}")
    print(f"   • PENDING: {Reservation.objects.filter(status=Reservation.Status.PENDING).count()}")
    print(f"   • COMPLETED: {Reservation.objects.filter(status=Reservation.Status.COMPLETED).count()}")
    print(f"   • CANCELLED: {Reservation.objects.filter(status=Reservation.Status.CANCELLED).count()}")
    
    print(f"\n{Colors.OKGREEN}✅ Promotions:{Colors.ENDC}")
    print(f"   • Total: {len(promotions)}")
    
    print(f"\n{Colors.OKGREEN}✅ Inventory:{Colors.ENDC}")
    print(f"   • Total Items: {inventory_count}")
    
    print(f"\n{Colors.OKGREEN}✅ Payments:{Colors.ENDC}")
    print(f"   • Total: {len(payments)}")
    
    print(f"\n{Colors.OKGREEN}✅ Reviews:{Colors.ENDC}")
    print(f"   • Total: {len(reviews)}")
    
    print(f"\n{Colors.OKGREEN}✅ Notifications:{Colors.ENDC}")
    print(f"   • Total: {len(notifications)}")
    
    print(f"\n{Colors.OKGREEN}✅ Support Tickets:{Colors.ENDC}")
    print(f"   • Total: {len(tickets)}")
    
    print(f"\n{Colors.OKGREEN}✅ API Keys:{Colors.ENDC}")
    print(f"   • Total: {len(api_keys)}")
    print(f"   • Active: {APIKey.objects.filter(is_active=True).count()}")
    
    print(f"\n{Colors.OKGREEN}✅ Webhooks:{Colors.ENDC}")
    print(f"   • Total: {len(webhooks)}")
    
    print(f"\n{Colors.OKGREEN}✅ Analytics:{Colors.ENDC}")
    print(f"   • Total Reports: {len(analytics)}")
    
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.OKGREEN}{Colors.BOLD}🎉 Test data generation completed successfully!{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

@transaction.atomic
def main():
    """Main function to generate all test data."""
    parser = argparse.ArgumentParser(description='Generate comprehensive test data')
    parser.add_argument('--clear', action='store_true', help='Clear existing data before generating')
    args = parser.parse_args()
    
    print_header("🍽️  RESTAURANT PLATFORM - COMPREHENSIVE TEST DATA")
    
    try:
        # Clear existing data if requested
        if args.clear:
            clear_existing_data()
        
        # Create all data
        users = create_users()
        restaurants = create_restaurants(users['owners'])
        menu_items_count = create_menu_items(restaurants)
        tables_count = create_tables(restaurants)
        orders = create_orders(users['customers'], restaurants)
        reservations = create_reservations(users['customers'], restaurants)
        promotions = create_promotions(restaurants)
        inventory_count = create_inventory(restaurants)
        payments = create_payments(orders)
        reviews = create_reviews(users['customers'], restaurants)
        notifications = create_notifications(users)
        tickets = create_support_tickets(users)
        api_keys = create_api_keys(users['developer'])
        webhooks = create_webhooks(users['developer'])
        analytics = create_analytics(restaurants)
        
        # Print summary
        print_summary(
            users, restaurants, menu_items_count, tables_count, orders,
            reservations, promotions, inventory_count, payments, reviews,
            notifications, tickets, api_keys, webhooks, analytics
        )
        
    except Exception as e:
        print_error(f"Error during data generation: {str(e)}")
        raise

if __name__ == '__main__':
    main()
