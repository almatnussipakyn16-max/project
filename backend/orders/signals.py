from django.db.models.signals import post_save, pre_save
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


@receiver(pre_save, sender=Order)
def order_status_changed_handler(sender, instance, **kwargs):
    """Handle order status changes"""
    if instance.pk:
        try:
            old_instance = Order.objects.get(pk=instance.pk)
            if old_instance.status != instance.status:
                # Status changed - send notification
                send_order_status_update.delay(instance.id, instance.status)
        except Order.DoesNotExist:
            pass
