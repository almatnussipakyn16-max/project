#!/usr/bin/env python
"""
Скрипт для создания тестовых данных для Restaurant Platform
Запуск: python create_test_data.py
"""

import os
import sys
import django

# Настройка Django окружения
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Цвета для консоли
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def print_success(message):
    print(f"{Colors.OKGREEN}✓ {message}{Colors.ENDC}")


def print_info(message):
    print(f"{Colors.OKCYAN}ℹ {message}{Colors.ENDC}")


def print_header(message):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{message.center(60)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")


def create_users():
    """Создание тестовых пользователей с разными ролями"""
    print_header("Создание пользователей")
    
    users_data = [
        {
            'email': 'admin@restaurant.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'password': 'admin123',
            'is_staff': True,
            'is_superuser': True,
            'role': 'admin'
        },
        {
            'email': 'client@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'client123',
            'role': 'client'
        },
        {
            'email': 'owner@restaurant.com',
            'first_name': 'Alice',
            'last_name': 'Smith',
            'password': 'owner123',
            'role': 'restaurant_owner'
        },
        {
            'email': 'staff@restaurant.com',
            'first_name': 'Bob',
            'last_name': 'Johnson',
            'password': 'staff123',
            'role': 'restaurant_staff'
        },
        {
            'email': 'developer@api.com',
            'first_name': 'Dev',
            'last_name': 'Eloper',
            'password': 'dev123',
            'role': 'developer'
        },
        {
            'email': 'support@restaurant.com',
            'first_name': 'Support',
            'last_name': 'Agent',
            'password': 'support123',
            'role': 'support'
        },
    ]
    
    created_users = {}
    
    for user_data in users_data:
        role = user_data.pop('role')
        password = user_data.pop('password')
        
        # Проверяем, существует ли пользователь
        try:
            user = User.objects.get(email=user_data['email'])
            print_info(f"Пользователь уже существует: {user.email}")
            created = False
        except User.DoesNotExist:
            # Создаём нового пользователя
            user = User.objects.create(**user_data)
            user.set_password(password)
            
            # Устанавливаем роль, если поле существует
            if hasattr(user, 'role'):
                user.role = role
            
            user.save()
            print_success(f"Создан пользователь: {user.email} ({role})")
            created = True
        
        created_users[role] = user
    
    return created_users


def main():
    """Главная функция"""
    print_header("🍽️  RESTAURANT PLATFORM - СОЗДАНИЕ ТЕСТОВЫХ ДАННЫХ")
    
    try:
        # Создание пользователей
        users = create_users()
        
        print_header("✅ ГОТОВО!")
        print_info("Тестовые данные успешно созданы!")
        print_info("\n📋 Тестовые пользователи:\n")
        
        credentials = [
            ("Admin", "admin@restaurant.com", "admin123", "Полный доступ к системе"),
            ("Client", "client@example.com", "client123", "Клиент ресторана"),
            ("Restaurant Owner", "owner@restaurant.com", "owner123", "Владелец ресторана"),
            ("Staff", "staff@restaurant.com", "staff123", "Сотрудник ресторана"),
            ("Developer", "developer@api.com", "dev123", "Разработчик (API доступ)"),
            ("Support", "support@restaurant.com", "support123", "Техподдержка"),
        ]
        
        for role, email, password, description in credentials:
            print(f"  {Colors.OKBLUE}• {role}{Colors.ENDC}")
            print(f"    Email: {email}")
            print(f"    Password: {password}")
            print(f"    Описание: {description}\n")
        
        print(f"{Colors.WARNING}⚠️  В production окружении смените все пароли!{Colors.ENDC}\n")
        
    except Exception as e:
        print(f"{Colors.FAIL}❌ Ошибка: {str(e)}{Colors.ENDC}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()