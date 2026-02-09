from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Reservation
from .tasks import send_reservation_confirmation


@receiver(post_save, sender=Reservation)
def reservation_confirmed_handler(sender, instance, created, **kwargs):
    """Send confirmation when reservation is created or confirmed"""
    if instance.status == 'CONFIRMED':
        send_reservation_confirmation.delay(instance.id)
