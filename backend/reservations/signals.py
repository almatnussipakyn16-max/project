from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Reservation
from .tasks import send_reservation_confirmation


@receiver(post_save, sender=Reservation)
def reservation_confirmed_handler(sender, instance, created, update_fields, **kwargs):
    """Send confirmation when reservation status changes to CONFIRMED"""
    # Only send confirmation when:
    # 1. Newly created and already confirmed, OR
    # 2. Status was updated to CONFIRMED (update_fields contains 'status' or is None)
    if instance.status == 'CONFIRMED':
        if created or update_fields is None or 'status' in update_fields:
            send_reservation_confirmation.delay(instance.id)
