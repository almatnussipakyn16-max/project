from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .tasks import (
    send_order_confirmation_email,
    send_order_status_update,
    notify_restaurant_new_order,
)


@receiver(post_save, sender=Order)
def order_created_handler(sender, instance, created, **kwargs):
    """Handle new order creation"""
    if created:
        # Send confirmation to customer
        send_order_confirmation_email.delay(instance.id)
        
        # Notify restaurant
        notify_restaurant_new_order.delay(instance.id)


@receiver(post_save, sender=Order)
def order_status_changed_handler(sender, instance, created, update_fields, **kwargs):
    """Handle order status changes"""
    # If status was updated (not creation and update_fields contains 'status' or update_fields is None)
    if not created and (update_fields is None or 'status' in update_fields):
        # Only send notification if we know status changed
        # The task will handle checking if it actually changed
        send_order_status_update.delay(instance.id, instance.status)
