from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User


class Notification(models.Model):
    """Notification model."""
    
    class Type(models.TextChoices):
        ORDER = 'ORDER', _('Order')
        RESERVATION = 'RESERVATION', _('Reservation')
        PROMOTION = 'PROMOTION', _('Promotion')
        SYSTEM = 'SYSTEM', _('System')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(_('type'), max_length=20, choices=Type.choices)
    title = models.CharField(_('title'), max_length=255)
    message = models.TextField(_('message'))
    data = models.JSONField(_('additional data'), blank=True, null=True)
    
    is_read = models.BooleanField(_('read'), default=False)
    read_at = models.DateTimeField(_('read at'), blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f'{self.title} - {self.user.email}'
