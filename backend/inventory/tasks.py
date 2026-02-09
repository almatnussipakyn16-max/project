from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.db import models


@shared_task
def check_low_stock_alerts():
    """Check for low stock items and send alerts"""
    from inventory.models import InventoryItem
    from notifications.models import Notification
    
    low_stock_items = InventoryItem.objects.filter(
        current_quantity__lte=models.F('minimum_quantity')
    )
    
    # Group by restaurant
    from collections import defaultdict
    items_by_restaurant = defaultdict(list)
    
    for item in low_stock_items:
        items_by_restaurant[item.restaurant].append(item)
    
    for restaurant, items in items_by_restaurant.items():
        # Create notification
        Notification.objects.create(
            user=restaurant.owner,
            type='SYSTEM',
            title='Low Stock Alert',
            message=f'{len(items)} items are running low in stock',
            link='/dashboard/inventory'
        )
        
        # Send email
        items_list = '\n'.join([f'- {item.name}: {item.current_quantity} {item.unit} (min: {item.minimum_quantity})' for item in items])
        
        send_mail(
            'Low Stock Alert',
            f'The following items are running low:\n\n{items_list}',
            settings.DEFAULT_FROM_EMAIL,
            [restaurant.email],
            fail_silently=False,
        )


@shared_task
def deduct_inventory_for_order(order_id):
    """Deduct inventory when order is confirmed"""
    from orders.models import Order
    from inventory.models import InventoryItem
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return
    
    # This is a simplified version - in production you'd have
    # a mapping between menu items and inventory items
    # For now, just demonstrate the concept
    pass
