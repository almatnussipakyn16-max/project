from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from restaurants.models import Restaurant


class Table(models.Model):
    """Table model."""
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='tables')
    table_number = models.CharField(_('table number'), max_length=20)
    capacity = models.IntegerField(_('capacity'))
    is_available = models.BooleanField(_('available'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('table')
        verbose_name_plural = _('tables')
        db_table = 'tables'
        unique_together = [['restaurant', 'table_number']]
    
    def __str__(self):
        return f'Table {self.table_number} (Capacity: {self.capacity})'


class Reservation(models.Model):
    """Reservation model."""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        CONFIRMED = 'CONFIRMED', _('Confirmed')
        SEATED = 'SEATED', _('Seated')
        COMPLETED = 'COMPLETED', _('Completed')
        CANCELLED = 'CANCELLED', _('Cancelled')
        NO_SHOW = 'NO_SHOW', _('No Show')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reservations')
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True, related_name='reservations')
    
    reservation_number = models.CharField(_('reservation number'), max_length=50, unique=True)
    guest_count = models.IntegerField(_('guest count'))
    reservation_date = models.DateField(_('reservation date'))
    reservation_time = models.TimeField(_('reservation time'))
    status = models.CharField(_('status'), max_length=20, choices=Status.choices, default=Status.PENDING)
    
    special_requests = models.TextField(_('special requests'), blank=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('reservation')
        verbose_name_plural = _('reservations')
        db_table = 'reservations'
        ordering = ['-reservation_date', '-reservation_time']
        indexes = [
            models.Index(fields=['reservation_number']),
            models.Index(fields=['restaurant', 'reservation_date']),
            models.Index(fields=['user', 'status']),
        ]
    
    def __str__(self):
        return f'Reservation #{self.reservation_number}'
