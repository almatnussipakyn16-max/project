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


# Track previous status to detect changes
_order_status_tracker = {}


@receiver(post_save, sender=Order)
def order_status_changed_handler(sender, instance, created, **kwargs):
    """Handle order status changes"""
    if not created:
        # Get the previous status from tracker
        previous_status = _order_status_tracker.get(instance.pk)
        
        if previous_status and previous_status != instance.status:
            # Status changed - send notification
            send_order_status_update.delay(instance.id, instance.status)
        
        # Update tracker with new status
        _order_status_tracker[instance.pk] = instance.status
